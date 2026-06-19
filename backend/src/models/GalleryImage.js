import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Exterior", "Interior", "Food", "Decor", "Ambience"] },
    imageUrl: { type: String, required: true, trim: true },
    cloudinaryPublicId: { type: String, trim: true },
    alt: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isHomepage: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("GalleryImage", galleryImageSchema);
