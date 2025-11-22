import { Router } from "express";
const router = Router();

// Placeholder appointments routes
router.get("/", (req, res) => {
  res.json({ message: "Appointments route placeholder" });
});

export default router;
