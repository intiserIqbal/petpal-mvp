import express from "express";
import { protect } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications for logged-in user
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ notifications });
});

// Mark notification as read
router.post("/read/:id", protect, async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true });
  res.json({ success: true });
});

export default router;