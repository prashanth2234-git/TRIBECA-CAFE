import mongoose from "mongoose";

const breakSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    phone: String,
    email: { type: String, lowercase: true, trim: true },
    room: String,
    consultationFee: { type: Number, default: 0 },
    workingDays: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" }
    },
    breakTimes: { type: [breakSchema], default: [{ start: "13:00", end: "14:00" }] },
    leaveDays: [Date],
    slotDuration: { type: Number, default: 20 },
    avgConsultationMinutes: { type: Number, default: 12 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

doctorSchema.index({ name: "text", specialization: "text" });

export default mongoose.model("Doctor", doctorSchema);
