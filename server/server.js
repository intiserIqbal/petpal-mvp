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

dotenv.config();

// ✅ Initialize app first
const app = express();

// ---------------------------
// 🌐 Security & Global Middleware
// ---------------------------
app.use(helmet());                   // adds secure HTTP headers
app.use(morgan("dev"));              // logs all requests
app.use(express.json());             // parses JSON body

// Cross-origin config (Vite frontend)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ---------------------------
// 📌 Register Routes
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);

// ---------------------------
// 🧪 Test Route
// ---------------------------
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "PetPal API is running 🎉" });
});

// ---------------------------
// ❗ Error Handler (last)
// ---------------------------
app.use(errorHandler);

// ---------------------------
// 🚀 Start Server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
