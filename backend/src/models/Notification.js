import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    channel: { type: String, enum: ["email", "whatsapp", "in-app"], required: true },
    type: {
      type: String,
      enum: ["appointment-confirmation", "appointment-reminder", "token-alert", "queue-update", "system"],
      required: true
    },
    subject: String,
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    error: String,
    sentAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
