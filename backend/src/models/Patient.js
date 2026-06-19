import mongoose from "mongoose";

const previousVisitSchema = new mongoose.Schema(
  {
    date: Date,
    doctor: String,
    diagnosis: String,
    notes: String
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"], default: "prefer-not-to-say" },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: String,
    medicalHistory: String,
    allergies: [String],
    previousVisits: [previousVisitSchema]
  },
  { timestamps: true }
);

patientSchema.index({ name: "text", phone: "text", email: "text" });

export default mongoose.model("Patient", patientSchema);
