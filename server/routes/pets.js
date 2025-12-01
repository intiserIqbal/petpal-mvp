// server/routes/pets.js
// Full CRUD for Pet listings with search, filters, pagination,
// owner authorization, and sentiment integration hook.

const express = require('express');
const router = express.Router();

const Pet = require('../models/Pet');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { PetCreateSchema, PetUpdateSchema, PetSearchSchema } = require('../validation/petSchemas');

// ------------------------------
// Utils (Cloudinary + Sentiment)
// ------------------------------

// Placeholder Cloudinary upload handler.
// You can replace with actual implementation later.
// For now accept array of URLs in req.body.images.
async function handleImagesUpload(images = []) {
  // Expected: [{ url: "...", public_id: "..." }, ...]
  // In the future, implement Cloudinary uploads here.
  if (!Array.isArray(images)) return [];
  return images.map(img => ({
    url: img.url || img,
    public_id: img.public_id || null,
  }));
}

// Call sentiment endpoint internally
async function analyzeSentiment(serverRequest, text) {
  try {
    const response = await fetch(`${serverRequest.protocol}://${serverRequest.get('host')}/api/analyze-sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: serverRequest.headers.authorization },
      body: JSON.stringify({ text }),
    });
    return await response.json();
  } catch (err) {
    console.error('Sentiment analysis failed:', err.message);
    return null; // fail silently
  }
}

// ------------------------------
// Validators (Simple for now)
// Replace with zod schemas in next step
// ------------------------------

function validatePetPayload(body) {
  const errors = [];

  if (!body.name) errors.push("Name is required.");
  if (!body.species) errors.push("Species is required.");
  if (!body.description) errors.push("Description is required.");

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true };
}

// ------------------------------
// POST /api/pets (Create listing)
// ------------------------------
router.post('/', protect, validate(PetCreateSchema), async (req, res) => {
  try {
    const { valid, errors } = validatePetPayload(req.body);
    if (!valid) return res.status(400).json({ success: false, errors });

    const {
      name,
      species,
      breed,
      age,
      sex,
      description,
      location,
      images
    } = req.body;

    // Upload images or accept URLs directly
    const uploadedImages = await handleImagesUpload(images);

    // Create base pet
    const pet = new Pet({
      owner: req.user.id,
      name,
      species,
      breed,
      age,
      sex,
      description,
      location,
      images: uploadedImages,
    });

    // Sentiment analysis (optional)
    if (description) {
      const sentiment = await analyzeSentiment(req, description);
      if (sentiment && sentiment[0] && sentiment[0][0]) {
        const result = sentiment[0][0];
        pet.sentiment = {
          label: result.label,
          score: result.score,
          model: "distilbert-base-uncased-finetuned-sst-2-english",
          analyzedAt: new Date(),
        };
      }
    }

    const saved = await pet.save();
    return res.status(201).json({ success: true, pet: saved });

  } catch (err) {
    console.error("POST /api/pets error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// GET /api/pets (List + Search)
// ------------------------------
router.get('/', validate(PetSearchSchema, "query"), async (req, res) => {
  try {
    const {
      q,
      species,
      city,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await Pet.searchAndPaginate({
      q,
      species,
      city,
      page: Number(page),
      limit: Number(limit),
    });

    res.json({
      success: true,
      ...result,
    });

  } catch (err) {
    console.error("GET /api/pets:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// GET /api/pets/:id (Detail)
// ------------------------------
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email');

    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    res.json({ success: true, pet });

  } catch (err) {
    console.error("GET /api/pets/:id:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// PUT /api/pets/:id (Update)
// ------------------------------
router.put('/:id', protect, validate(PetUpdateSchema), async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    // Check ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const updates = req.body;

    // If images updated, handle upload or direct URLs
    if (updates.images) {
      updates.images = await handleImagesUpload(updates.images);
    }

    // If description changed → re-run sentiment
    if (updates.description) {
      const sentiment = await analyzeSentiment(req, updates.description);
      if (sentiment && sentiment[0] && sentiment[0][0]) {
        const result = sentiment[0][0];
        updates.sentiment = {
          label: result.label,
          score: result.score,
          model: "distilbert-base-uncased-finetuned-sst-2-english",
          analyzedAt: new Date(),
        };
      }
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, pet });

  } catch (err) {
    console.error("PUT /api/pets/:id:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// DELETE /api/pets/:id (Delete)
// ------------------------------
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    // Check ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Optional: Clean up Cloudinary images using public_id
    // TODO: implement later

    await pet.deleteOne();
    res.json({ success: true, message: "Pet deleted" });

  } catch (err) {
    console.error("DELETE /api/pets/:id:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
