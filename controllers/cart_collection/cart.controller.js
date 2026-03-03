import mongoose from "mongoose";
import { cartModel } from "../../models/cart/cart.model.js";
import { AppError } from "../../lib/error.js";

//add to cart
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "Valid user ID is required");
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError(400, "Items array is required");
  }

  //   if (!productId || !quantity || quantity <= 0) {
  //     throw new AppError(
  //       400,
  //       "Product ID and quantity in positive number are required",
  //     );
  //   }
  // Check if every item has a product field and a quantity greater than 0
  const validData = items.every(
    (item) =>
      item.product && typeof item.quantity === "number" && item.quantity > 0,
  );

  if (!validData) {
    return res.status(400).json({
      message:
        "Each item must have a valid product ID and a quantity greater than 0",
    });
  }
  //find cart for user here we have to reasign the value to cart so we use let
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    cart = new cartModel({
      user: userId,
      items,
    });
  } else {
    // Loop through each item in the request body
    items.forEach((newItem) => {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === newItem.product,
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        cart.items.push({
          product: newItem.product,
          quantity: newItem.quantity,
        });
      }
    });
  }

  await cart.save();
  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    // cart,
  });
};

//get cart
export const getCart = async (req, res) => {
  const userId = req.user._id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "Valid user ID is required");
  }
  //find cart first

  const cart = await cartModel.findOne({ user: userId });
  if (!cart) throw new AppError(404, "Cart not found for this user");
  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    cart,
  });
};

//update cart
export const updateCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "Valid user ID is required");
  }
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(400, "Valid product ID is required");
  }
  if (typeof quantity !== "number" || quantity < 0) {
    throw new AppError(400, "Quantity must be a positive number");
  }

  //find cart
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    throw new AppError(404, "Cart not found for this user");
  }

  //Find the item index in the array

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Product not in cart" });
  }

  // Update the quantity of the item
  if (quantity > 0) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    // Remove the item from the cart if quantity is 0 or less
    cart.items.splice(itemIndex, 1);
  }
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
};

//remove item from cart
export const removeItemFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId))
    throw new AppError(400, "Valid user ID is required");
  if (!productId || !mongoose.Types.ObjectId.isValid(productId))
    throw new AppError(400, "Valid product ID is required");

  //find cart
  const cart = await cartModel.findOne({ user: userId });

  if (!cart) throw new AppError(404, "Cart not found for this user");

  //Find the item index in the array
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) throw new AppError(404, "Product not in cart");

  //remove the item from the cart
  cart.items.splice(itemIndex, 1);

  await cart.save();
  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    cart,
  });
};

//clear cart
export const clearCart = async (req, res) => {
  const userId = req.user._id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, "Valid user ID is required");
  }
  const deletedCart = await cartModel.findOneAndDelete({ user: userId });
  if (!deletedCart) {
    throw new AppError(404, "Cart not found for this user");
  }
  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    deletedCart,
  });
};
