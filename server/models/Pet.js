// server/models/Pet.js
// Mongoose model for Pet listings used by PetPal

import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // <— simple array of strings
    sentiment: { type: String, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"], default: "NEUTRAL" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
