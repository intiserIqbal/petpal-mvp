import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  breed: String,
  age: Number,
  gender: String,
  weight: Number,
  description: String,
  medical: String,
  image: String,
  status: { type: String, default: "pending" } // pending, approved, rejected
});

export default mongoose.model("Pet", petSchema);
