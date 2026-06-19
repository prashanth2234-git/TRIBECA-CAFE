import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Coffee & Matcha", "Starters", "Pizza", "Pasta", "Main Course", "Soups", "Burgers", "Salads", "Sandwiches"]
    },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true },
    cloudinaryPublicId: { type: String, trim: true },
    badge: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("MenuItem", menuItemSchema);
