import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product category is required"],
  },

  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },

  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  imagesURL: {
    type: [String],
    required: [true, "Product imagesURL is required"],
    message: "At least one image URL is required",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const productModel = mongoose.model("Product", productSchema);
