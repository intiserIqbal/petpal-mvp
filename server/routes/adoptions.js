// server/routes/adoptions.js
import express from "express";
import AdoptionRequest from "../models/AdoptionRequest.js";
import Notification from "../models/Notification.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// submit adoption request
router.post("/submit", protect, async (req, res) => {
  try {
    const { pet, address, homeInfo } = req.body;
    if (!pet) {
      return res.status(400).json({ message: "Pet ID is required." });
    }
    const adoption = new AdoptionRequest({
      user: req.user._id,
      pet, // <-- Make sure this is included!
      address,
      homeInfo,
      status: "pending"
    });
    await adoption.save();
    res.status(201).json({ message: "Adoption request submitted!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit adoption request." });
  }
});

// pending requests
router.get("/pending", protect, isAdmin, async (req, res) => {
  const requests = await AdoptionRequest.find({ status: "pending" })
    .populate("user", "name email")
    .populate("pet", "name breed image images");


  res.json({ requests });
});

// approved requests
router.get("/approved", protect, isAdmin, async (req, res) => {
  const requests = await AdoptionRequest.find({ status: "approved" })
    .populate("user", "name email")
    .populate("pet", "name breed image images");


  res.json({ requests });
});

// rejected requests
router.get("/rejected", protect, isAdmin, async (req, res) => {
  const requests = await AdoptionRequest.find({ status: "rejected" })
    .populate("user", "name email")
    .populate("pet", "name breed image images");


  res.json({ requests });
});

// update status
router.put("/update/:id", protect, isAdmin, async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const reqDoc = await AdoptionRequest.findById(req.params.id);
  if (!reqDoc) return res.status(404).json({ message: "Request not found" });

  reqDoc.status = status;
  await reqDoc.save();

  // ✅ Adoption notification
  await Notification.create({
    user: reqDoc.user,
    message:
      status === "approved"
        ? `🎉 Your adoption request has been APPROVED!`
        : `❌ Your adoption request has been REJECTED.`,
    type: "adopt",
  });

  res.json({ success: true });
});

// GET adoption notifications
router.get("/notifications", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id, type: "adopt" }).sort({ createdAt: -1 });
  res.json({ notifications });
});

// Mark adoption notifications as read
router.put("/notifications/read", protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, type: "adopt" }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

// Cancel adoption request (user only)
router.delete("/cancel/:id", protect, async (req, res) => {
  const request = await AdoptionRequest.findOne({ _id: req.params.id, user: req.user._id });
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "pending") {
    return res.status(400).json({ message: "Only pending requests can be cancelled" });
  }
  await request.deleteOne();
  res.json({ success: true });
});

export default router;
