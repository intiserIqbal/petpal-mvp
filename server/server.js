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
import chatbotRoutes from "./routes/chatbot.js";
import reviewRoutes from "./routes/reviews.js";
import userRouter from "./routes/user.js";
import notificationsRouter from "./routes/notifications.js";

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

// ---------------------------
// CORS (move before route mounts)
// ---------------------------
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // This will be "https://petpal12.netlify.app" on Render
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// ---------------------------
// Routes (mount after CORS)
// ---------------------------
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

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
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRouter);
app.use("/api/notifications", notificationsRouter);


// Health check
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Root GET + HEAD so "/" responds (fixes "Cannot GET /")
app.route("/")
  .get((_req, res) => res.send("PetPal API is running!✍️🔥"))
  .head((_req, res) => res.send("PetPal API is running!✍️🔥"));

// Ensure listen uses PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ---------------------------
// Error handler (last)
// ---------------------------
app.use(errorHandler);
