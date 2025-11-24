import express from "express";
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Appointments route working" });
});

export default router;
