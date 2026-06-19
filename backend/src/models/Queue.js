import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    tokenNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["waiting", "current", "completed", "cancelled"],
      default: "waiting"
    },
    checkedInAt: { type: Date, default: Date.now },
    calledAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

queueSchema.index({ doctor: 1, date: 1, tokenNumber: 1 }, { unique: true });
queueSchema.index({ appointment: 1 }, { unique: true });

export default mongoose.model("Queue", queueSchema);
