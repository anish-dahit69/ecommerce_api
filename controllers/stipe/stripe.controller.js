//create payment
import { createPaymentIntent } from "../../services/paymentService.js";
import { AppError } from "./../../lib/error.js";
import { orderModel } from "./../../models/order/order.model.js";


export const createPayment = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) throw new AppError(400, "orderId is required");

  const order = await orderModel.findById(orderId);

  if (!order) throw new AppError(404, "Order not found");

  if (order.payment.status === "paid")
    throw new AppError(400, "Order is already paid");

  const paymentIntent = await createPaymentIntent(order);

  res.status(200).json({
    success: true,
    message: "PaymentIntent created successfully",
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
};
