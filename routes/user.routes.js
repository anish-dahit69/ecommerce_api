import express from "express";
import { asyncHandler } from "../lib/asynchandler.js";
import {
  addAddress,
  deleteAddress,
  getAddress,
  getUserAddress,
  getUserProfile,
  updateAddress,
} from "../controllers/user_controller/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

export const userRouter = express.Router();

userRouter.use(isLoggedIn); //all routes after this middleware will require authentication

userRouter.get("/profile", asyncHandler(getUserProfile));
userRouter.post("/address", asyncHandler(addAddress));
userRouter.get("/view-address", asyncHandler(getAddress));
userRouter.get("/view-user-address", asyncHandler(getUserAddress));
userRouter.put("/address/:id", asyncHandler(updateAddress));
userRouter.delete("/address/:id", asyncHandler(deleteAddress));
