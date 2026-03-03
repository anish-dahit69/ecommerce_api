import stripe from "stripe";
import { orderModel } from "../models/order/order.model";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (order) => {
  const amountInPaisa = Math.round(order.pricing.total * 100);

  return await stripeInstance.paymentIntents.create({
    amount: amountInPaisa, // paisa
    currency: "npr",
    automatic_payment_methods: {
      enabled: true,
    },

    description: order.orderNumber,

    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      user: order.user.toString(),
    },
  });
};
