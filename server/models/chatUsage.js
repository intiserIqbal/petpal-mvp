import mongoose from "mongoose";

const ChatUsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  requests: { type: Number, default: 0 },
  tokensUsed: { type: Number, default: 0 },
}, { timestamps: true });

ChatUsageSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("ChatUsage", ChatUsageSchema);