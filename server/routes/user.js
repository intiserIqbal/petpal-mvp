import express from "express";
import { protect } from "../middleware/auth.js";
import Pet from "../models/Pet.js";
import AdoptionRequest from "../models/AdoptionRequest.js";
import ChatUsage from "../models/ChatUsage.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userInfo = await User.findById(userId).select("name email avatar");

    // Get user's pets
    const pets = await Pet.find({ owner: userId });

    // Get user's adoption requests
    const adoptions = await AdoptionRequest.find({ user: userId }).populate("pet");

    // Get today's chat usage
    const today = new Date().toISOString().slice(0, 10);
    const chatUsage = await ChatUsage.findOne({ user: userId, date: today });

    res.json({
      user: userInfo,
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

// PUT /api/user/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar },
      { new: true, runValidators: true, fields: "name email avatar" }
    );
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile." });
  }
});

export default router;