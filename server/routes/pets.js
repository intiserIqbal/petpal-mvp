import express from "express";
import { protect } from "../middleware/auth.js";
import Pet from "../models/Pet.js";
import Review from "../models/Review.js";

const router = express.Router();

// ------------------------------
// POST /api/pets (Create listing)
// ------------------------------
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      species,
      age,
      location,
      description,
      images = [], // array of strings (filenames/URLs)
      sentiment, // optional string: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
    } = req.body;

    const pet = new Pet({
      title,
      species,
      age,
      location,
      description,
      images,
      sentiment,
      owner: req.user._id,
    });

    // Optionally run sentiment analysis (non-blocking)
    try {
      if (description && description.trim().length > 0) {
        const response = await fetch(
          `${req.protocol}://${req.get("host")}/api/analyze-sentiment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization,
            },
            body: JSON.stringify({ text: description }),
          }
        );
        if (response.ok) {
          const json = await response.json();
          if (json?.sentiment) {
            pet.sentiment = json.sentiment; // store plain string
          }
        }
      }
    } catch (err) {
      console.warn("Sentiment call failed (non-blocking):", err.message || err);
    }

    const saved = await pet.save();
    await saved.populate("owner", "name");
    return res.status(201).json(saved); // return pet directly
  } catch (err) {
    console.error("POST /api/pets error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// PUT /api/pets/:id (Update)
// ------------------------------
router.put("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    // ownership check
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const {
      title,
      species,
      age,
      location,
      description,
      images,
      sentiment,
    } = req.body;

    if (title !== undefined) pet.title = title;
    if (species !== undefined) pet.species = species;
    if (age !== undefined) pet.age = age;
    if (location !== undefined) pet.location = location;
    if (description !== undefined) pet.description = description;
    if (images !== undefined) pet.images = images; // overwrite with provided array
    if (sentiment !== undefined) pet.sentiment = sentiment;

    // Re-run sentiment if description changed
    if (req.body.description) {
      try {
        const response = await fetch(
          `${req.protocol}://${req.get("host")}/api/analyze-sentiment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization,
            },
            body: JSON.stringify({ text: req.body.description }),
          }
        );
        if (response.ok) {
          const json = await response.json();
          if (json?.sentiment) {
            pet.sentiment = json.sentiment; // store plain string
          }
        }
      } catch (err) {
        console.warn("Re-sentiment failed (non-blocking):", err.message || err);
      }
    }

    const updated = await pet.save();
    await updated.populate("owner", "name");
    return res.json(updated); // return pet directly
  } catch (err) {
    console.error("PUT /api/pets/:id error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ------------------------------
// GET /api/pets
// ------------------------------
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.q) {
      query.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { species: { $regex: req.query.q, $options: "i" } },
        { location: { $regex: req.query.q, $options: "i" } },
      ];
    }

    const [pets, total] = await Promise.all([
      Pet.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("owner", "name"),
      Pet.countDocuments(query),
    ]);

    res.json({ pets, total, hasMore: skip + pets.length < total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
});

// GET /api/pets/:id
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("owner", "name");
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pet" });
  }
});

// DELETE /api/pets/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Review.deleteMany({ pet: pet._id });
    await Pet.deleteOne({ _id: pet._id }); // no Cloudinary deletion
    res.json({ message: "Pet deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete pet" });
  }
});

// GET /api/pets/:id/reviews  (needed by client)
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ pet: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "name");
    res.json(reviews);
  } catch (err) {
    console.error("GET /api/pets/:id/reviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

export default router;
