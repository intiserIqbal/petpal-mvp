// server/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import petRoutes from "./routes/pets.js";
import appointmentRoutes from "./routes/appointments.js";
import { connectDB } from "./db/connect.js";
import adoptionRoutes from "./routes/adoptions.js";


import adminRoutes from "./routes/admin.js";

// ---------------------------
// Load environment variables
// ---------------------------
dotenv.config();

// ---------------------------
// Connect to MongoDB
// ---------------------------
connectDB();

// ---------------------------
// Initialize app
// ---------------------------
const app = express();

// ---------------------------
// Security & middleware
// ---------------------------
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/admin", adminRoutes);


// ---------------------------
// CORS
// ---------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ---------------------------
// Ensure uploads folder exists
// ---------------------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ---------------------------
// Serve uploaded images via route with proper CORS headers
// ---------------------------
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Fix for Chrome cross-origin image loading
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  res.sendFile(filePath);
});

// ---------------------------
// Routes
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/adoptions", adoptionRoutes);


// Test route
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "PetPal API is running 🎉" });
});

// ---------------------------
// Error handler (last)
// ---------------------------
app.use(errorHandler);

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
