// server/routes/sentiment.js
import express from "express";
import { protect } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Prompt for classification
    const prompt = `
Classify the sentiment of the following text as POSITIVE, NEGATIVE, or NEUTRAL.
Text: "${text}"
Return only one word.
    `;

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        // 🔄 UPDATED MODEL: Use llama-3.1-8b-instant (the fast, small, current version)
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Sentiment Error:", data);
      return res.status(500).json({ error: "Groq API error", details: data });
    }

    const sentiment = data?.choices?.[0]?.message?.content?.trim();

    res.json({
      success: true,
      sentiment,
    });
  } catch (err) {
    console.error("Sentiment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;