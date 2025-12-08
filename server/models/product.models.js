import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
