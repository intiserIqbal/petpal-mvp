// server/routes/reviews.js
// Routes to add/list/delete reviews for pets.
// - POST /api/pets/:petId/reviews  -> add review (protected)
// - GET  /api/pets/:petId/reviews  -> list reviews (public)
// - DELETE /api/reviews/:id        -> delete review (protected; author or pet owner)

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Pet = require('../models/Pet');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ReviewCreateSchema } = require('../validation/reviewSchemas');

// Helper: call internal sentiment route (same approach as pets.js)
async function analyzeSentimentInternal(req, text) {
  try {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/analyze-sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: req.headers.authorization },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    // data.result expected like [[{ label, score }]]
    if (!data || !data.result) return null;
    return data.result;
  } catch (err) {
    console.error('analyzeSentimentInternal error:', err.message);
    return null;
  }
}

// ------------------------------
// POST /api/pets/:petId/reviews
// ------------------------------
router.post('/pets/:petId/reviews', protect, validate(ReviewCreateSchema), async (req, res) => {
  try {
    const { petId } = req.params;
    const { rating, comment } = req.body;

    // Basic validation
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'rating (1-5) is required' });
    }

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

    // Prevent owner from reviewing own pet (optional business rule)
    if (pet.owner.toString() === req.user.id) {
      return res.status(403).json({ success: false, message: 'Owners cannot review their own pet' });
    }

    // Call sentiment analysis for the comment (if present)
    let sentimentObj = null;
    let flagged = false;
    if (comment && comment.trim().length > 0) {
      const hfResult = await analyzeSentimentInternal(req, comment);
      // hfResult expected: [[{label, score}]]
      if (hfResult && Array.isArray(hfResult) && hfResult[0] && hfResult[0][0]) {
        const r = hfResult[0][0];
        sentimentObj = {
          label: r.label,
          score: r.score,
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          analyzedAt: new Date(),
        };

        // Simple auto-moderation rule:
        // Flag if NEGATIVE or score < 0.40
        if (r.label === 'NEGATIVE' || (typeof r.score === 'number' && r.score < 0.40)) {
          flagged = true;
        }
      }
    }

    const review = await Review.create({
      pet: petId,
      user: req.user.id,
      rating,
      comment,
      sentiment: sentimentObj,
      flagged,
    });

    res.status(201).json({ success: true, review });

  } catch (err) {
    console.error('POST /pets/:petId/reviews error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ------------------------------
// GET /api/pets/:petId/reviews
// ------------------------------
router.get('/pets/:petId/reviews', async (req, res) => {
  try {
    const { petId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ pet: petId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email')
        .lean()
        .exec(),
      Review.countDocuments({ pet: petId })
    ]);

    // compute average rating
    const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / (reviews.length)) : 0;

    res.json({
      success: true,
      reviews,
      total,
      page: Number(page),
      limit: Number(limit),
      averageRating: avg,
    });
  } catch (err) {
    console.error('GET /pets/:petId/reviews error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ------------------------------
// DELETE /api/reviews/:id
// Only author or pet owner can delete
// ------------------------------
router.delete('/reviews/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const pet = await Pet.findById(review.pet);
    if (!pet) return res.status(404).json({ success: false, message: 'Associated pet not found' });

    // Allow deletion if requester is review author OR pet owner
    if (review.user.toString() !== req.user.id && pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });

  } catch (err) {
    console.error('DELETE /reviews/:id error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
