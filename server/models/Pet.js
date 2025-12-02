// server/models/Pet.js
// Mongoose model for Pet listings used by PetPal

import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String }, // Cloudinary public id (optional, useful for deletes)
}, { _id: false });

const PetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  species: { type: String, required: true, trim: true, maxlength: 60 },
  breed: { type: String, trim: true, maxlength: 80 },
  age: { type: Number, min: 0 },
  sex: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },
  location: {
    city: { type: String, trim: true, maxlength: 100 },
    region: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
  },
  description: { type: String, trim: true, maxlength: 3000 },
  images: {
    type: [ImageSchema],
    default: [],
    validate: [arr => arr.length <= 10, "Max 10 images allowed"],
  },
  sentiment: {
    label: { type: String },
    score: { type: Number },
    model: { type: String },
    analyzedAt: { type: Date },
  },
  isPublished: { type: Boolean, default: true },
  archived: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
PetSchema.index({
  name: "text",
  species: "text",
  breed: "text",
  "location.city": "text",
  description: "text",
}, {
  name: "PetTextIndex",
  weights: { name: 5, species: 4, breed: 3, description: 1 },
  default_language: "english",
});

PetSchema.index({ species: 1, "location.city": 1, createdAt: -1 });

// Helpers
PetSchema.methods.setSentiment = async function (sentimentObj = {}) {
  this.sentiment = {
    label: sentimentObj.label || null,
    score: typeof sentimentObj.score === "number" ? sentimentObj.score : null,
    model: sentimentObj.model || null,
    analyzedAt: new Date(),
  };
  return this.save();
};

PetSchema.statics.searchAndPaginate = async function ({
  q, species, city, page = 1, limit = 10, sort = "-createdAt"
} = {}) {
  const filter = { archived: { $ne: true }, isPublished: true };
  if (species) filter.species = species;
  if (city) filter["location.city"] = city;

  const query = q ? { $text: { $search: q } } : {};
  const finalQuery = { ...filter, ...query };
  const skip = (Math.max(1, page) - 1) * limit;

  const [docs, total] = await Promise.all([
    this.find(finalQuery).sort(sort).skip(skip).limit(limit).lean().exec(),
    this.countDocuments(finalQuery),
  ]);

  return { docs, total, page: Math.max(1, page), limit, pages: Math.ceil(total / limit) || 1 };
};

// ✅ ESM default export
export default mongoose.model("Pet", PetSchema);
