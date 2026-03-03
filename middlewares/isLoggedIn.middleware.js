import { AppError } from "../lib/error.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  let token;
  if (req.cookies?.token) token = req.cookies.token;
  if (!token) throw new AppError(401, "Please login first");

  //verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) throw new AppError(401, "Invalid token. Please login again");

  //find user with decoded id and attach to req
  const user = await userModel
    .findById({ _id: decoded.id })
    .select("-password -OTP -OTPExpiry -OTPAttempts");
  if (!user) throw new AppError(404, "User not found");
  req.user = user;
  next();
};
