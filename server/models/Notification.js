import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["adopt", "rehome"], default: "adopt" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } // <--- important
);


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
