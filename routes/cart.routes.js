import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeItemFromCart,
  updateCart,
} from "../controllers/cart_collection/cart.controller.js";
import { asyncHandler } from "../lib/asynchandler.js";

export const cartRouter = express.Router();

cartRouter.use(isLoggedIn);

cartRouter.post("/add-to-cart", asyncHandler(addToCart));
cartRouter.get("/view-cart", asyncHandler(getCart));
cartRouter.patch("/update-cart/:productId", asyncHandler(updateCart));
cartRouter.delete("/remove-item/:productId", asyncHandler(removeItemFromCart));
cartRouter.delete("/clear-cart", asyncHandler(clearCart));
