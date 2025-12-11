import express from "express";
import { protect } from "../middleware/auth.js";
import Pet from "../models/Pet.js";

const router = express.Router();

// Simple in-memory per-user rate limiter
const rateMap = new Map(); // userId => { count, reset }

router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // rate limit: 6 requests per 60s
    const now = Date.now();
    const windowMs = 60_000;
    const maxReq = 6;
    let state = rateMap.get(userId);
    if (!state || now > state.reset) {
      state = { count: 0, reset: now + windowMs };
    }
    if (state.count >= maxReq) {
      return res.status(429).json({ message: "Rate limit exceeded, try again later" });
    }
    state.count += 1;
    rateMap.set(userId, state);

    const { text, petId } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Query text is required" });
    }

    let pet = null;
    if (petId) {
      try { pet = await Pet.findById(petId).lean(); } catch { pet = null; }
    }

    const petContext = pet
      ? `Pet info:
Title: ${pet.title || "N/A"}
Species: ${pet.species || "N/A"}
Age: ${pet.age ?? "N/A"}
Location: ${pet.location || "N/A"}
Description: ${pet.description || ""}`
      : "";

    const prompt = `You are a veterinary assistant. Use the pet info below if available. Answer concisely and include a safety disclaimer for medical advice.

${petContext}

User question:
${text}

Respond in plain text.`;

    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful veterinary assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    const data = await groqResp.json();
    let answer = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate an answer right now.";

    if (answer.length > 3000) answer = answer.slice(0, 3000) + "...";

    return res.json({ answer });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({ answer: "Service temporarily unavailable. Please try again later." });
  }
});

export default router;