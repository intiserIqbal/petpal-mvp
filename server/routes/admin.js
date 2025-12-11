// server/routes/admin.js
import express from "express";
import User from "../models/User.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
