import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  adminCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ----------------------
// REGISTER
// ----------------------
router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password, adminCode } = req.validatedData;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let role = "user";
    if (adminCode && adminCode === process.env.ADMIN_SECRET) role = "admin";

    const user = await User.create({ name, email, passwordHash, role });

    const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("REGISTER ERROR →", err);
    res.status(500).json({ success: false, message: err.message || "Registration failed" });
  }
});

// ----------------------
// LOGIN
// ----------------------
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.validatedData;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);



    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("LOGIN ERROR →", err);
    res.status(500).json({ success: false, message: err.message || "Login failed" });
  }
});

export default router;
