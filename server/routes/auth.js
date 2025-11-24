// server/routes/auth.js
import { Router } from "express";
const router = Router();

// Firebase test route
router.get("/firebase-test", (req, res) => {
  res.json({ ok: true, message: "Firebase test route working ✅" });
});

export default router;
