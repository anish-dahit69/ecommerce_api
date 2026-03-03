import stripe from "stripe";
import { orderModel } from "../../models/order/order.model.js";
import { productModel } from "./../../models/products.model.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebHook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructiveEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Webhook Error: " + error.message,
    });
  }
  //handle event types
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      const paidOrder = await orderModel.findByIdAndUpdate(
        paymentIntent.metadata.orderId,
        {
          "payment.status": "paid",
          orderStatus: "confirmed",
        },
        {
          returnDocument: "after",
        },
      );
      //  Reduce stock for each item
      for (const item of paidOrder.items) {
        await productModel.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
      break;
    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;

      const failedOrder = await orderModel.findByIdAndUpdate(failedIntent.metadata.orderId, {
        "payment.status": "failed",
      });
      //  increase stock for each item
    //   for (const item of failedOrder.items) {
    //     await productModel.findByIdAndUpdate(item.product, {
    //       $inc: { stock: item.quantity },
    //     });
    //   }
      break;
  }

  res.json({
    received: true,
  });
};
