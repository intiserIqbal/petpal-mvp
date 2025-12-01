// server/models/Pet.js
// Mongoose model for Pet listings used by PetPal
// Fields: owner (User ref), name/title, species, age, location, description,
// images (array of { url, public_id }), sentiment (cached HF result),
// and timestamps. Includes text index for basic search and a helper to set sentiment.

const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String }, // Cloudinary public id (optional, useful for deletes)
}, { _id: false });

const PetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Basic listing info
  name: { type: String, required: true, trim: true, maxlength: 120 },
  species: { type: String, required: true, trim: true, maxlength: 60 }, // e.g. dog, cat
  breed: { type: String, trim: true, maxlength: 80 },
  age: {
    // store as number of years (float allowed) or as string if you want "puppy"
    type: Number,
    min: 0,
    // optional: allow null/undefined when unknown
  },
  sex: { type: String, enum: ['male','female','unknown'], default: 'unknown' },

  location: {
    // simple city/country text. If you want geospatial queries later, change to GeoJSON.
    city: { type: String, trim: true, maxlength: 100 },
    region: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
    // optionally add coords: { lat: Number, lng: Number }
  },

  description: { type: String, trim: true, maxlength: 3000 },

  // Images saved from Cloudinary (or any host): url + public_id to allow deletion
  images: {
    type: [ImageSchema],
    default: [],
    validate: [arr => arr.length <= 10, 'Max 10 images allowed'],
  },

  // Sentiment analysis result from HuggingFace (cached)
  // Example: { label: "POSITIVE", score: 0.98, model: "distilbert..." }
  sentiment: {
    label: { type: String },
    score: { type: Number },
    model: { type: String },
    analyzedAt: { type: Date },
  },

  // Optional extra metadata
  isPublished: { type: Boolean, default: true }, // allow drafts in future
  archived: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// TEXT INDEX for basic search across name, species, breed, description, city
// This provides efficient text search for 'q' queries (note: Atlas free tier has limits)
PetSchema.index({
  name: 'text',
  species: 'text',
  breed: 'text',
  'location.city': 'text',
  description: 'text',
}, {
  name: 'PetTextIndex',
  weights: { name: 5, species: 4, breed: 3, description: 1 },
  default_language: 'english',
});

// Compound index for common filters (species + location + createdAt)
PetSchema.index({ species: 1, 'location.city': 1, createdAt: -1 });

// Instance helper to set/update sentiment (used by route after calling HF)
PetSchema.methods.setSentiment = async function(sentimentObj = {}) {
  this.sentiment = {
    label: sentimentObj.label || null,
    score: typeof sentimentObj.score === 'number' ? sentimentObj.score : null,
    model: sentimentObj.model || null,
    analyzedAt: new Date(),
  };
  return this.save();
};

// Static helper to perform a safe paginated search query. Returns { docs, total, page, limit }
PetSchema.statics.searchAndPaginate = async function({ q, species, city, page = 1, limit = 10, sort = '-createdAt' } = {}) {
  const filter = { archived: { $ne: true }, isPublished: true };

  if (species) filter.species = species;
  if (city) filter['location.city'] = city;

  const query = q ? { $text: { $search: q } } : {};

  const finalQuery = { ...filter, ...query };

  const skip = (Math.max(1, page) - 1) * limit;

  const [docs, total] = await Promise.all([
    this.find(finalQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    this.countDocuments(finalQuery),
  ]);

  return {
    docs,
    total,
    page: Math.max(1, page),
    limit,
    pages: Math.ceil(total / limit) || 1,
  };
};

module.exports = mongoose.model('Pet', PetSchema);
