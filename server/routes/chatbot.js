import fetch from "node-fetch";
import express from "express";
import { protect } from "../middleware/auth.js";
import Pet from "../models/Pet.js";
import ChatUsage from "../models/ChatUsage.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// in-memory short window limiter
const rateMap = new Map();

// env-configurable limits
const MINUTE_LIMIT = Number(process.env.CHAT_MINUTE_LIMIT ?? 6);
const DAILY_REQUEST_LIMIT = Number(process.env.CHAT_DAILY_LIMIT ?? 200); // requests/day per user
const DAILY_TOKEN_LIMIT = Number(process.env.CHAT_TOKEN_DAILY_LIMIT ?? 20000); // tokens/day per user
const MONTHLY_TOKEN_LIMIT = Number(process.env.CHAT_TOKEN_MONTHLY_LIMIT ?? 100000); // tokens/month per user
const GLOBAL_DAILY_TOKENS = Number(process.env.CHAT_GLOBAL_DAILY_TOKENS ?? 500000); // global tokens/day

const todayKey = () => new Date().toISOString().slice(0, 10);
const monthKey = () => new Date().toISOString().slice(0, 7); // YYYY-MM

function isGreeting(text) {
  if (!text || typeof text !== "string") return false;
  const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"];
  const lower = text.toLowerCase();
  return greetings.some(g => lower.includes(g));
}

function isPetRelated(text) {
  if (!text || typeof text !== "string") return false;
  const keywords = [
    "pet","dog","cat","puppy","kitten","adopt","adoption","vet","veterinary","food",
    "feed","groom","breed","vaccin","vaccination","medical","symptom","health",
    "training","behavior","leash","collar","spay","neuter","age","weight","flea","tick",
    "medicine","ill","injur","sick","allerg","behavioral","diet","nutrition"
  ];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { text, petId } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) return res.status(400).json({ message: "Query text required" });

    // 1) Greeting: reply with a short, friendly message
    if (isGreeting(text)) {
      return res.json({
        answer: "Hello! 👋 I'm PetPal Assistant. Ask me anything about pet care!"
      });
    }

    // 2) Non-pet queries: reply with a polite redirect
    if (!isPetRelated(text)) {
      return res.json({
        answer: "I'm here to help with pet care questions. For other topics, please search the internet."
      });
    }

    // per-minute limiter
    const now = Date.now();
    const windowMs = 60_000;
    let state = rateMap.get(userId) || { count: 0, reset: now + windowMs };
    if (now > state.reset) state = { count: 0, reset: now + windowMs };
    if (state.count >= MINUTE_LIMIT) return res.status(429).json({ message: "Rate limit exceeded (per-minute)." });
    state.count += 1;
    rateMap.set(userId, state);

    const date = todayKey();
    // persistent usage doc for user/day
    let usage = await ChatUsage.findOne({ user: userId, date });
    if (!usage) usage = new ChatUsage({ user: userId, date });

    // check per-user request daily limit
    if (usage.requests >= DAILY_REQUEST_LIMIT) {
      return res.status(429).json({ message: "Daily chatbot request limit reached." });
    }

    // compute current per-user token totals (today + month)
    const monthStart = monthKey();
    const monthlyAgg = await ChatUsage.aggregate([
      { $match: { user: usage.user, date: { $regex: `^${monthStart}` } } },
      { $group: { _id: null, tokens: { $sum: "$tokensUsed" } } },
    ]);
    const tokensThisMonth = (monthlyAgg[0]?.tokens) ?? 0;

    // compute global tokens used today
    const globalAgg = await ChatUsage.aggregate([
      { $match: { date } },
      { $group: { _id: null, tokens: { $sum: "$tokensUsed" } } },
    ]);
    const globalTokensToday = (globalAgg[0]?.tokens) ?? 0;
    if (globalTokensToday >= GLOBAL_DAILY_TOKENS) {
      return res.status(503).json({ message: "Chat service rate-limited due to global quota. Try again later." });
    }

    // optional pet context
    let pet = null;
    if (petId) {
      try { pet = await Pet.findById(petId).lean(); } catch {}
    }
    const petContext = pet ? `Title: ${pet.title || ""}\nSpecies: ${pet.species || ""}\nAge: ${pet.age ?? ""}\n${pet.description || ""}` : "";

    const systemMsg = "You are the PetPal Assistant. Always identify as 'PetPal Assistant'. Be concise. Include a brief safety disclaimer for medical topics.";
    const prompt = `${petContext}\nUser: ${text}`;

    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemMsg }, { role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    if (!groqResp.ok) {
      const txt = await groqResp.text().catch(() => "");
      console.error("Groq error:", groqResp.status, txt);
      return res.status(502).json({ message: "Upstream service error" });
    }

    const data = await groqResp.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() ?? "No answer.";
    const tokensUsed = data?.usage?.total_tokens ?? Math.max(1, Math.ceil((text.length + answer.length) / 4));

    // check per-user token caps BEFORE committing
    if (usage.tokensUsed + tokensUsed > DAILY_TOKEN_LIMIT) {
      return res.status(429).json({ message: "Daily token quota exceeded for your account." });
    }
    if (tokensThisMonth + tokensUsed > MONTHLY_TOKEN_LIMIT) {
      return res.status(429).json({ message: "Monthly token quota exceeded for your account." });
    }
    if (globalTokensToday + tokensUsed > GLOBAL_DAILY_TOKENS) {
      return res.status(503).json({ message: "Global token quota would be exceeded by this request. Try again later." });
    }

    // commit usage
    usage.requests += 1;
    usage.tokensUsed += tokensUsed;
    await usage.save();

    return res.json({
      answer,
      usage: { requestsToday: usage.requests, tokensToday: usage.tokensUsed, dailyRequestLimit: DAILY_REQUEST_LIMIT, dailyTokenLimit: DAILY_TOKEN_LIMIT },
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;