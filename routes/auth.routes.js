import express from "express";
import { asyncHandler } from "../lib/asynchandler.js";
import {
  getLoggedInUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

export const authRouter = express.Router();

authRouter.get("/me", isLoggedIn, asyncHandler(getLoggedInUser));
authRouter.post("/register", asyncHandler(registerUser));
authRouter.post("/verify-otp", asyncHandler(verifyOTP));
authRouter.post("/login", asyncHandler(loginUser));
authRouter.post("/logout", asyncHandler(logoutUser));
