// server/models/Review.js
// Review model for PetPal

import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 2000,
  },

  // Cached sentiment from HuggingFace for moderation/analytics
  sentiment: {
    label: { type: String },
    score: { type: Number },
    model: { type: String },
    analyzedAt: { type: Date },
  },

  // Auto-moderation flag (true = needs moderation / possibly abusive)
  flagged: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// ✅ ESM default export
export default mongoose.model("Review", ReviewSchema);
