import { Router } from "express";
const router = Router();

// Placeholder pets routes
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Buddy", type: "Dog" },
    { id: 2, name: "Mittens", type: "Cat" }
  ]);
});

export default router;
