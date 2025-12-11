import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // FIXED
  name: String,
  breed: String,
  age: Number,
  gender: String,
  weight: Number,
  description: String,
  medical: String,
  image: String,
  status: { type: String, default: "pending" }
});

export default mongoose.model("Pet", petSchema);
