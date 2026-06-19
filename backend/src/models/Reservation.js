import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 40 },
    specialRequests: { type: String, trim: true },
    status: { type: String, enum: ["pending", "confirmed", "seated", "cancelled"], default: "confirmed" },
    source: { type: String, default: "website" }
  },
  { timestamps: true }
);

reservationSchema.index({ date: 1, time: 1 });

export default mongoose.model("Reservation", reservationSchema);
