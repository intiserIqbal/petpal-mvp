// server/routes/pets.js
import express from "express";
import Pet from "../models/Pet.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { PetCreateSchema, PetUpdateSchema, PetSearchSchema } from "../validation/petSchemas.js";

import { validateCloudinaryUrl, extractPublicId, deleteImage } from "../utils/cloudinary.js";

const router = express.Router();

// Helper: sanitize images array (incoming are expected to be URLs from client-side Cloudinary upload)
function sanitizeImageUrls(imageUrls = []) {
  if (!Array.isArray(imageUrls)) return [];
  const out = [];
  for (const url of imageUrls) {
    if (typeof url !== "string") continue;
    if (!validateCloudinaryUrl(url)) continue;
    const public_id = extractPublicId(url);
    out.push({ url, public_id });
  }
  return out;
}

// ------------------------------
// POST /api/pets (Create listing)
// ------------------------------
router.post("/", protect, validate(PetCreateSchema), async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      sex,
      description,
      location,
      images: incomingImages,
    } = req.body;

    const images = sanitizeImageUrls(incomingImages);

    const pet = new Pet({
      owner: req.user.id,
      name,
      species,
      breed,
      age,
      sex,
      description,
      location,
      images,
    });

    // Optionally run sentiment analysis (if you want to keep the internal call as before)
    // Note: keep it non-blocking/fail-safe
    try {
      if (description && description.trim().length > 0) {
        const response = await fetch(`${req.protocol}://${req.get("host")}/api/analyze-sentiment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
          },
          body: JSON.stringify({ text: description }),
        });
        if (response.ok) {
          const json = await response.json();
          if (json?.result && Array.isArray(json.result) && json.result[0] && json.result[0][0]) {
            const r = json.result[0][0];
            pet.sentiment = { label: r.label, score: r.score, model: "distilbert-base-uncased-finetuned-sst-2-english", analyzedAt: new Date() };
          }
        }
      }
    } catch (err) {
      console.warn("Sentiment call failed (non-blocking):", err.message || err);
    }

    const saved = await pet.save();
    return res.status(201).json({ success: true, pet: saved });
  } catch (err) {
    console.error("POST /api/pets error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// GET /api/pets (List + Search)
// ------------------------------
router.get("/", validate(PetSearchSchema, "query"), async (req, res) => {
  try {
    const { q, species, city, page = 1, limit = 10 } = req.query;
    const result = await Pet.searchAndPaginate({
      q,
      species,
      city,
      page: Number(page),
      limit: Number(limit),
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error("GET /api/pets:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// GET /api/pets/:id (Detail)
// ------------------------------
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("owner", "name email");
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });
    return res.json({ success: true, pet });
  } catch (err) {
    console.error("GET /api/pets/:id:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// PUT /api/pets/:id (Update)
// ------------------------------
router.put("/:id", protect, validate(PetUpdateSchema), async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    // ownership check
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // If client sends new images (array of Cloudinary URLs) then:
    if (req.body.images && Array.isArray(req.body.images)) {
      // Delete previously stored cloudinary images (if any have public_id)
      if (Array.isArray(pet.images) && pet.images.length > 0) {
        for (const img of pet.images) {
          if (img.public_id) {
            // attempt deletion but don't block on failure
            await deleteImage(img.public_id).catch((e) => {
              console.warn("Failed deleting cloud image:", e);
            });
          }
        }
      }
      // sanitize and set new images
      pet.images = sanitizeImageUrls(req.body.images);
    }

    // Apply other updates (safe fields)
    const allowed = ["name", "species", "breed", "age", "sex", "description", "location"];
    for (const k of allowed) {
      if (k in req.body) pet[k] = req.body[k];
    }

    // If description changed then re-run sentiment (non-blocking if fails)
    if (req.body.description) {
      try {
        const response = await fetch(`${req.protocol}://${req.get("host")}/api/analyze-sentiment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
          },
          body: JSON.stringify({ text: req.body.description }),
        });
        if (response.ok) {
          const json = await response.json();
          if (json?.result && json.result[0] && json.result[0][0]) {
            const r = json.result[0][0];
            pet.sentiment = { label: r.label, score: r.score, model: "distilbert-base-uncased-finetuned-sst-2-english", analyzedAt: new Date() };
          }
        }
      } catch (err) {
        console.warn("Re-sentiment failed (non-blocking):", err.message || err);
      }
    }

    const updated = await pet.save();
    return res.json({ success: true, pet: updated });
  } catch (err) {
    console.error("PUT /api/pets/:id error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// DELETE /api/pets/:id (Delete)
// ------------------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    // ownership check
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // delete cloudinary images
    if (Array.isArray(pet.images) && pet.images.length > 0) {
      for (const img of pet.images) {
        if (img.public_id) {
          await deleteImage(img.public_id).catch((e) => {
            console.warn("Failed deleting cloud image:", e);
          });
        }
      }
    }

    await pet.deleteOne();
    return res.json({ success: true, message: "Pet deleted" });
  } catch (err) {
    console.error("DELETE /api/pets/:id error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
