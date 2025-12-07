import express from "express";
import { protect } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    // NOTE: Changed from 'query' to 'text' for consistency if you're using a single input field
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        // 🔄 UPDATED MODEL: Use llama-3.1-8b-instant
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful pet advisor." },
          { role: "user", content: query }
        ],
      }),
    });


    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Error:", data);
      return res.status(500).json({ error: "Groq API error", details: data });
    }

    const answer = data?.choices?.[0]?.message?.content || "No answer";

    res.json({ success: true, answer });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;