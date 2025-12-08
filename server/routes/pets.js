// server/routes/pets.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import Pet from "../models/Pet.js";

const router = express.Router();

// ---------------------------
// Multer setup
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
// Auth middleware
// ---------------------------
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ---------------------------
// Helper to sanitize strings
// ---------------------------
const sanitize = (str) => (typeof str === "string" ? str.replace(/"/g, "") : str);

// ---------------------------
// POST /rehome - Submit new pet
// ---------------------------
router.post("/rehome", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const newPet = new Pet({
      user: req.userId,
      name: sanitize(req.body.name),
      breed: sanitize(req.body.breed),
      age: req.body.age,
      gender: sanitize(req.body.gender),
      weight: req.body.weight,
      description: sanitize(req.body.description),
      medical: sanitize(req.body.medical),
      status: "pending",
      image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null,
    });

    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------
// GET /mine - Get pets of logged-in user
// ---------------------------
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.userId });
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------
// DELETE /:id - Delete a pet
// ---------------------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, user: req.userId });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Delete the image file if it exists
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

export default router;
