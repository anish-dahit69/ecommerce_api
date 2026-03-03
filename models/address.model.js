import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    city: { type: String, required: true },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const addressModel = mongoose.model("Address", addressSchema);
