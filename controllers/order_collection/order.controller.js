import mongoose from "mongoose";
import { AppError } from "./../../lib/error.js";
import { productModel } from "./../../models/products.model.js";
import { generateOrderNumber } from "../../lib/orderNum.js";
import { orderModel } from "../../models/order/order.model.js";
import { cartModel } from "../../models/cart/cart.model.js";

//create order
export const createOrder = async (req, res) => {
  const userId = req.user._id;
  if (!userId)
    throw new AppError(400, "Unauthorized,please login to place an order");

  const { shippingAddress, paymentMethod } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.city ||
    !shippingAddress.street
  )
    throw new AppError(400, "Shipping address is required");

  if (!paymentMethod) throw new AppError(400, "Payment method is required");

  // fetch product from cart items to get the latest price and stock information
  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product", "name price stock imagesURL");

  if (!cart || cart.items.length === 0)
    throw new AppError(
      400,
      "Your cart is empty, add items to cart before placing an order",
    );

  // build order items with snapshot data

  const orderitems = [];
  let subTotal = 0;

  cart.items.forEach((item) => {
    const product = item.product; // This is the populated product document
    if (!product)
      throw new AppError(400, "Product not found for one of the cart items");

    if (product.stock < item.quantity)
      throw new AppError(400, `Insufficient stock for product ${product.name}`);

    const itemSubTotal = product.price * item.quantity;
    subTotal += itemSubTotal;

    orderitems.push({
      product: product._id,
      name: product.name,
      image: product.imagesURL[0], // Assuming the first image is the main image
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubTotal,
    });
  });

  // calculate total price of the order
  const shippingFee = 150;
  const tax = subTotal * 0.13; // 13% tax
  const discount = 0;
  const total = subTotal + shippingFee + tax - discount;

  // generate unique order number
  const orderNumber = generateOrderNumber();

  // Create order document

  const orderInfo = await orderModel.create({
    orderNumber,
    user: userId,
    items: orderitems,
    pricing: { subtotal: subTotal, shippingFee, tax, discount, total },
    shippingAddress,
    payment: {
      method: paymentMethod,
      status: paymentMethod === "COD" ? "pending" : "paid",
    },
  });

  // reduce stock of the products ordered
  for (const item of orderitems) {
    await productModel.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  //  Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order: orderInfo,
  });
};

//get all orders of a user
export const getUserOrder = async (req, res) => {
  const userId = req.user.id;
  if (!userId)
    throw new AppError(400, "Unauthorized,please login to view your orders");
  const order = await orderModel
    .find({
      user: userId,
    })
    .sort({ createdAt: -1 });
  if (!order || order.length === 0)
    throw new AppError(404, "No orders found for this user");
  res.status(200).json({
    success: true,
    orders: order,
  });
};

//get order by id
export const getOrderById = async (req, res) => {
  const userId = req.user.id;
  // console.log("User ID from token:", userId); // Debugging line to check user ID
  const { id: orderId } = req.params; // Assuming your route is /:id

  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }

  // This acts as an AND operation: both must match
  const order = await orderModel.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    // We say "Order not found" for security, even if the ID exists but belongs to someone else
    throw new AppError(404, "Order not found or access denied");
  }

  res.status(200).json({
    success: true,
    message: "Order details fetched successfully",
    order,
  });
};

//cancel order
export const cancelOrder = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  if (!orderId)
    throw new AppError(400, "Order ID is required to cancel an order");

  const order = await orderModel.findOne({
    user: userId,
    _id: orderId,
  });
  if (!order) throw new AppError(404, "Order not found or access denied");

  const cancellableStatuses = ["pending", "confirmed", "processing"]; // Define which statuses allow cancellation

  if (!cancellableStatuses.includes(order.orderStatus))
    throw new AppError(
      400,
      `Order cannot be cancelled at this stage. Current status: ${order.orderStatus}`,
    );

  for (const item of order.items) {
    const updatedProduct = await productModel.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
    order.orderStatus = "cancelled";
    order.cancelReason = req.body.reason || "No reason provided";
    order.cancelledAt = new Date();
  }

  await order.save();
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
};

//track order status
export const orderTracking = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError(400, "Invalid order ID format");
  }

  if (!orderId)
    throw new AppError(400, "Order ID is required to track an order");
  const order = await orderModel.findOne({
    user: userId,
    _id: orderId,
  });
  if (!order) throw new AppError(404, "Order not found or access denied");
  res.status(200).json({
    success: true,
    message: "Order status fetched successfully",
    orderStatus: order.orderStatus,
    trackingNumber: order.trackingNumber ?? "Not available yet",
  });
};
