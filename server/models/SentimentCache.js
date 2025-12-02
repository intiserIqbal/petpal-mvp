// server/models/SentimentCache.js
// Stores cached sentiment results to reduce HuggingFace API calls (free tier safe).

import mongoose from "mongoose";

const SentimentCacheSchema = new mongoose.Schema({
  textHash: { type: String, required: true, unique: true },
  result: { type: Object, required: true },   // HF full JSON response
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 }, 
  // expires: auto-delete after 24 hours (MongoDB TTL index)
});

// ✅ ESM default export
export default mongoose.model("SentimentCache", SentimentCacheSchema);
