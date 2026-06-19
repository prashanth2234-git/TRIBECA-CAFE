import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    photo: { type: String, trim: true },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
