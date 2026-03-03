import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true }, // snapshot
  image: { type: String }, // snapshot
  price: { type: Number, required: true }, // snapshot price
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }, // price * quantity
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    pricing: {
      subtotal: { type: Number, required: true },
      shippingFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: String,
      city: { type: String, required: true },
      area: String,
      street: { type: String, required: true },
      postalCode: String,
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "Esewa", "Khalti", "Stripe"],
        default: "COD",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    cancelReason: String,
    cancelledAt: {
      type: Date,
      default: null,
    },

    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true },
);

export const orderModel = mongoose.model("Order", orderSchema);
