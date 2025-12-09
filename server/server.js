// server/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import petRoutes from "./routes/pets.js";
import reviewRoutes from "./routes/review.js";
import sentimentRoutes from "./routes/sentiment.js";
import uploadsRouter from "./routes/uploads.js";
import chatRoutes from "./routes/chat.js";
import { connectDB } from "./db/connect.js";

dotenv.config();
connectDB();

const app = express();

// Serve local uploads
app.use("/uploads", express.static("uploads"));

// ----------------------------
// Middleware
// ----------------------------
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "200kb" })); // safe JSON limit

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ----------------------------
// Routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analyze-sentiment", sentimentRoutes);
app.use("/api/uploads", uploadsRouter);
app.use("/api/chat", chatRoutes);

// Health check route for Render
app.get("/health", (req, res) => {
  res.send("OK");
});

// Test route
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "PetPal API is running 🎉" });
});

app.get("/", (req, res) => {
  res.send("PetPal API is running.");
});

// Error handler
app.use(errorHandler);

// ----------------------------
// Route listing
// ----------------------------
try {
  console.log("\nRegistered routes:");
  app._router.stack
    .filter((r) => r.route)
    .forEach((r) => {
      const methods = Object.keys(r.route.methods)
        .map((m) => m.toUpperCase())
        .join(",");
      console.log(`  ${methods}  ${r.route.path}`);
    });
} catch (e) {
  console.warn("Could not list routes.");
}

// ----------------------------
// Start Server
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
