import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientSnapshot: {
      name: String,
      phone: String,
      email: String
    },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    symptoms: { type: String, trim: true },
    status: {
      type: String,
      enum: ["booked", "checked-in", "in-consultation", "completed", "cancelled", "no-show"],
      default: "booked"
    },
    tokenNumber: String,
    cancellationReason: String,
    checkedInAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } });
appointmentSchema.index({ patient: 1, date: -1 });

export default mongoose.model("Appointment", appointmentSchema);
