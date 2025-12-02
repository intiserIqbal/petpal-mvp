// server/utils/cloudinary.js
// Cloudinary helper for PetPal (ESM).
// - Loads config from .env
// - validateCloudinaryUrl(url) -> bool
// - extractPublicId(url) -> public_id string or null
// - deleteImage(publicId) -> calls cloudinary.uploader.destroy

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables from .env
dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME) {
  console.warn("⚠️ CLOUDINARY_CLOUD_NAME is not set. Cloudinary helpers may fail.");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Validate that the URL belongs to your Cloudinary account + desired folder.
 * Very small whitelist to avoid arbitrary remote URLs being injected.
 */
export function validateCloudinaryUrl(url) {
  try {
    if (!url || typeof url !== "string") return false;
    const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/`;
    if (!url.startsWith(base)) return false;

    // Optionally ensure it contains the configured folder (if provided)
    if (CLOUDINARY_FOLDER && CLOUDINARY_FOLDER.length > 0) {
      if (!url.includes(`/${CLOUDINARY_FOLDER}/`)) return false;
    }

    // Basic check for an image extension (jpg, jpeg, png, webp)
    if (!/\.(jpg|jpeg|png|webp)(?:$|\?)/i.test(url)) return false;

    return true;
  } catch (err) {
    console.error("validateCloudinaryUrl error:", err);
    return false;
  }
}

/**
 * Try to extract public_id from a Cloudinary URL.
 * Cloudinary uploads default URL pattern often contains /upload/v<version>/<public_id>.<ext>
 */
export function extractPublicId(url) {
  try {
    if (!validateCloudinaryUrl(url)) return null;

    const match = url.match(/\/upload\/v\d+\/(.+)\.(jpg|jpeg|png|webp)(?:$|\?)/i);
    if (!match || !match[1]) return null;
    return match[1]; // e.g. "petpal/uploads/abc123"
  } catch (err) {
    console.error("extractPublicId error:", err);
    return null;
  }
}

/**
 * Delete image by public_id (Cloudinary)
 */
export async function deleteImage(publicId) {
  try {
    if (!publicId) return { ok: false, message: "publicId missing" };
    const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return { ok: true, result: res };
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return { ok: false, error: err.message || String(err) };
  }
}

export default cloudinary;
