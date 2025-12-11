// models/AdoptionRequest.js
import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },  // if you choose to track which pet
  address: {
    line1: String,
    line2: String,
    postcode: String,
    town: String,
    district: String,
    mobile: String,
  },
  homeInfo: {
    spaceAvailable: String,
    sleepingPlace: String,
    ownOrRent: String,
    petExperience: String,
    hasFence: String,
  },
  status: { type: String, default: "pending" }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AdoptionRequest", adoptionSchema);
