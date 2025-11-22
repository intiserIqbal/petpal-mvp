import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Explicit CORS config
app.use(cors({
  origin: "http://localhost:5173", // allow your Vite frontend
  credentials: true
}));

app.use(express.json());

// Test route
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "PetPal API is running 🎉" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
