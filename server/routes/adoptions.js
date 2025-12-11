// server/routes/adoptions.js
import express from "express";
import AdoptionRequest from "../models/AdoptionRequest.js";
import Notification from "../models/Notification.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// submit adoption request
router.post("/submit", protect, async (req, res) => {
  const { address, homeInfo, petId } = req.body;

  const newReq = new AdoptionRequest({
    user: req.user._id,
    pet: petId,
    address,
    homeInfo,
  });

  await newReq.save();

  // ✅ Adoption notification
  await Notification.create({
    user: req.user._id,
    message: `Your adoption request for pet (${petId}) has been submitted.`,
    type: "adopt",
  });

  res.status(201).json(newReq);
});

// pending requests
router.get("/pending", protect, isAdmin, async (req, res) => {
  const requests = await AdoptionRequest.find({ status: "pending" })
    .populate("user", "name email")
    .populate("pet", "name breed image");

  res.json({ requests });
});

// approved requests
router.get("/approved", protect, isAdmin, async (req, res) => {
  const requests = await AdoptionRequest.find({ status: "approved" })
    .populate("user", "name email")
    .populate("pet", "name breed image");

  res.json({ requests });
});

// rejected requests
router.get("/rejected", protect, isAdmin, async (req, res) => {
  const requests = await AdoptionRequest.find({ status: "rejected" })
    .populate("user", "name email")
    .populate("pet", "name breed image");

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

export default router;
