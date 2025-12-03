// server/routes/uploads.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { validateCloudinaryUrl, extractPublicId } from "../utils/cloudinary.js";

const router = express.Router();

/**
 * POST /api/uploads/verify
 * Validate client-side unsigned upload URL.
 */
router.post("/verify", protect, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, message: "url is required" });
    }

    if (!validateCloudinaryUrl(url)) {
      return res.status(400).json({ success: false, message: "Invalid Cloudinary URL" });
    }

    const public_id = extractPublicId(url);

    return res.json({
      success: true,
      url,
      public_id,
    });
  } catch (err) {
    console.error("POST /api/uploads/verify:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * POST /api/uploads/proxy
 * Server-side upload (Cloudinary fetch URL).
 */
router.post("/proxy", protect, async (req, res) => {
  try {
    const { remote_url } = req.body;

    if (!remote_url || typeof remote_url !== "string") {
      return res.status(400).json({ success: false, message: "remote_url is required" });
    }

    if (!/^https?:\/\//i.test(remote_url)) {
      return res.status(400).json({ success: false, message: "remote_url must be a valid http(s) url" });
    }

    const cloudinary = (await import("../utils/cloudinary.js")).default;

    const folder = process.env.CLOUDINARY_FOLDER || "petpal/uploads";

    const options = {
      folder,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    cloudinary.uploader
      .upload(remote_url, options)
      .then((result) => {
        return res.json({ success: true, result });
      })
      .catch((error) => {
        console.error("Cloudinary proxy upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed",
        });
      });
  } catch (err) {
    console.error("POST /api/uploads/proxy error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
