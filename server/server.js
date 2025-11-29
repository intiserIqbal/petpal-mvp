// server/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import petRoutes from "./routes/pets.js";
import appointmentRoutes from "./routes/appointments.js";
import { connectDB } from "./db/connect.js";

// ---------------------------
// Load environment variables
// Must happen before using process.env
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
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ---------------------------
// Routes
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);

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
