import { Router } from "express";
const router = Router();

// Placeholder auth routes
router.get("/", (req, res) => {
  res.json({ message: "Auth route placeholder" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login route placeholder" });
});

export default router;
