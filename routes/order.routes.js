import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { asyncHandler } from "../lib/asynchandler.js";
import {
    cancelOrder,
  createOrder,
  getOrderById,
  getUserOrder,
} from "../controllers/order_collection/order.controller.js";

export const orderRouter = express.Router();

orderRouter.use(isLoggedIn); //all routes after this middleware will require authentication

orderRouter.post("/place-order", asyncHandler(createOrder));
orderRouter.get("/my-orders", asyncHandler(getUserOrder));
orderRouter.get("/my-orders/:id", asyncHandler(getOrderById));
orderRouter.put("/cancel-order/:id", asyncHandler(cancelOrder));
