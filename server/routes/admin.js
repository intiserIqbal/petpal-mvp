// server/routes/admin.js
import express from "express";
import { protect } from "../middleware/auth.js";
import ChatUsage from "../models/ChatUsage.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import AdoptionRequest from "../models/AdoptionRequest.js";

const router = express.Router();

// simple admin guard helper (define isAdmin)
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
}

// GET /api/admin/chat-usage?date=YYYY-MM-DD&userId=...
router.get("/chat-usage", protect, isAdmin, async (req, res) => {
  try {
    const date = req.query.date ?? new Date().toISOString().slice(0, 10);
    const userId = req.query.userId;
    const q = { date };
    if (userId) q.user = userId;
    const rows = await ChatUsage.find(q).populate("user", "name email").lean();
    return res.json({ date, rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
});

// GET /api/admin/chat-usage/summary?date=YYYY-MM-DD
router.get("/chat-usage/summary", protect, isAdmin, async (req, res) => {
  try {
    const date = req.query.date ?? new Date().toISOString().slice(0, 10);
    const agg = await ChatUsage.aggregate([
      { $match: { date } },
      { $group: { _id: null, totalRequests: { $sum: "$requests" }, totalTokens: { $sum: "$tokensUsed" } } },
    ]);
    return res.json({ date, totalRequests: agg[0]?.totalRequests ?? 0, totalTokens: agg[0]?.totalTokens ?? 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
});

// POST /api/admin/chat-usage/reset  { userId, date? }
router.post("/chat-usage/reset", protect, isAdmin, async (req, res) => {
  try {
    const { userId, date } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const q = date ? { user: userId, date } : { user: userId };
    const result = await ChatUsage.deleteMany(q);
    return res.json({ ok: true, deleted: result.deletedCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
});

router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Example: Approve/Reject adoption request
router.post("/adoptions/:id/status", protect, isAdmin, async (req, res) => {
  const { status } = req.body; // "approved" or "rejected"
  const adoption = await AdoptionRequest.findById(req.params.id);
  if (!adoption) return res.status(404).json({ message: "Request not found" });

  adoption.status = status;
  await adoption.save();

  // Create notification for user
  await Notification.create({
    user: adoption.user,
    message: `Your adoption request for ${adoption.pet} has been ${status}.`,
    type: "adopt",
    read: false,
  });

  res.json({ success: true });
});

// GET /api/admin/adoptions/pending
router.get("/adoptions/pending", protect, isAdmin, async (req, res) => {
  const adoptions = await AdoptionRequest.find({ status: "pending" })
    .populate("pet user");
  res.json({ adoptions });
});

export default router;
