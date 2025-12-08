import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import Pet from "../models/Pet.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ---------------------------
// Multer upload config
// ---------------------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

// ---------------------------
// Middleware
// ---------------------------
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin")
    return res.status(403).json({ message: "Access denied" });

  next();
};

// Sanitize helper
const sanitize = (str) =>
  typeof str === "string" ? str.replace(/"/g, "") : str;

// ============================
// POST rehome pet
// ============================
router.post("/rehome", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const newPet = new Pet({
      owner: req.userId,
      name: sanitize(req.body.name),
      breed: sanitize(req.body.breed),
      age: req.body.age,
      gender: sanitize(req.body.gender),
      weight: req.body.weight,
      description: sanitize(req.body.description),
      medical: sanitize(req.body.medical),
      status: "pending",
      image: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : null,
    });

    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// GET my pets
// ============================
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.userId });
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// DELETE pet
// ============================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.image) {
      const filePath = path.join(uploadDir, path.basename(pet.image));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Pet.deleteOne({ _id: req.params.id });

    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================
// ADMIN ROUTES
// ============================

// Get pending pets
router.get("/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find({ status: "pending" })
      .populate("owner", "name email");
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve / reject pet
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    pet.status = status;
    await pet.save();

    await Notification.create({
      user: pet.owner,
      message: `Your rehome request for ${pet.name} has been ${status}.`,
    });

    res.json({ success: true, message: `Pet ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch notifications
router.get("/notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId }).sort({
      time: -1,
    });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FETCH APPROVED pets (WITH owner info) 🚀 FIXED
router.get("/approved", verifyToken, isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find({ status: "approved" })
      .populate("owner", "name email");
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FETCH REJECTED pets (WITH owner info) 🚀 FIXED
router.get("/rejected", verifyToken, isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find({ status: "rejected" })
      .populate("owner", "name email");
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
