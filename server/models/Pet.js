// models/Pet.js
import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  gender: String,
  weight: Number,
  description: String,
  medical: String,
  status: { type: String, default: "available" }, // available, adopted
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Pet", petSchema);
