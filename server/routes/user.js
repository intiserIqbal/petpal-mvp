import express from "express";
import { protect } from "../middleware/auth.js";
import Pet from "../models/Pet.js";
import AdoptionRequest from "../models/AdoptionRequest.js";
import ChatUsage from "../models/ChatUsage.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's pets
    const pets = await Pet.find({ owner: userId });

    // Get user's adoption requests
    const adoptions = await AdoptionRequest.find({ user: userId }).populate("pet");

    // Get today's chat usage
    const today = new Date().toISOString().slice(0, 10);
    const chatUsage = await ChatUsage.findOne({ user: userId, date: today });

    res.json({
      pets,
      adoptions,
      chatUsage: chatUsage
        ? { requests: chatUsage.requests, tokensUsed: chatUsage.tokensUsed }
        : { requests: 0, tokensUsed: 0 },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile." });
  }
});

export default router;