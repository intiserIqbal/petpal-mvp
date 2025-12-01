// server/routes/sentiment.js
// HuggingFace sentiment analysis endpoint with rate limiting and caching.

const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const SentimentCache = require('../models/SentimentCache');
const { protect } = require('../middleware/auth');

// ------------------------
// Rate limiting (free tier)
// ------------------------
let lastCall = 0;
const HF_INTERVAL = 1200; // 1.2 seconds between calls (safe)

// ------------------------
// Hash helper for caching
// ------------------------
function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// ------------------------
// POST /api/analyze-sentiment
// ------------------------
router.post('/', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }

    const textHash = hashText(text.trim());

    // 1. Check Cache
    const cached = await SentimentCache.findOne({ textHash });
    if (cached) {
      return res.json({ success: true, source: "cache", result: cached.result });
    }

    // 2. Rate limit HF calls
    const now = Date.now();
    if (now - lastCall < HF_INTERVAL) {
      return res.status(429).json({
        success: false,
        message: "Rate limit: Please wait before sending another sentiment request."
      });
    }
    lastCall = now;

    // 3. Make HuggingFace API request
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!hfResponse.ok) {
      return res.status(500).json({
        success: false,
        message: "HuggingFace API Error",
        status: hfResponse.status,
      });
    }

    const data = await hfResponse.json(); // expected: [[{label, score}]]

    // 4. Save result in cache
    await SentimentCache.create({
      textHash,
      result: data,
    });

    res.json({ success: true, source: "huggingface", result: data });

  } catch (err) {
    console.error("Sentiment route error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
