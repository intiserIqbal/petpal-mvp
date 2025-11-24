import express from "express";
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Pets route working" });
});

export default router;
