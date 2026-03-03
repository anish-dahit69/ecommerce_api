import { userModel } from "../models/user.model.js";
import { AppError } from "../lib/error.js";
import { generateOTP, getOTPExpiry, isOTPExpired } from "../lib/otp.js";
import bcrypt from "bcrypt";
import { mailConfiguration } from "../lib/nodemailer.js";
import { generateToken } from "./../lib/tokenGenerator.js";

// api/auth/me - get logged in user details
export const getLoggedInUser = async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json({
    success: true,
    message: "Logged in user details fetched successfully",
    user: user,
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, contact } = req.body;
  if (!name || !email || !password || !contact) {
    throw new AppError(400, "All fields are required");
  }
  // Check if the user already exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { name }],
  });
  if (existingUser)
    throw new AppError(400, "User with this email or name already exists");

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  //generate OTP and expiry time
  const OTP = generateOTP();
  const OTPExpiry = getOTPExpiry(10); // OTP valid for 10 minutes

  // Create a new user

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
    contact,
    role: "user",
    OTP,
    OTPExpiry,
  });
  //send OTP email
  mailConfiguration(newUser.email, OTP);

  res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please verify your email with the OTP sent.",
    user: newUser,
  });
};

//verification of OTP and email
export const verifyOTP = async (req, res) => {
  if (!req.body) {
    throw new AppError(400, "Request body is missing");
  }
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new AppError(400, "Email and OTP are required");
  }
  const user = await userModel.findOne({
    email,
  });
  if (!user) throw new AppError(404, "User not found");

  if (user.isVerified) throw new AppError(400, "Email is already verified");
  if (user.OTP !== otp) {
    user.OTPAttempts += 1;
    await user.save();
    throw new AppError(400, "Invalid OTP");
  }

  if (user.OTPAttempts >= 5) {
    throw new AppError(
      400,
      "Maximum OTP attempts exceeded. Please request a new OTP.",
    );
  }

  if (isOTPExpired(user.OTPExpiry)) {
    throw new AppError(400, "OTP has expired. Please request a new OTP.");
  }

  // If OTP is valid, mark user as verified
  user.isVerified = true;
  user.OTP = "";
  user.OTPExpiry = 0;
  user.OTPAttempts = 0;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
};

// login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError(400, "Email and password are required");

  const user = await userModel.findOne({ email });
  if (!user) throw new AppError(404, "User not found");

  if (!user.isVerified) throw new AppError(400, "User is not verified");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError(400, "Credentials are incorrect");

  //set cookie

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
  });
};

//logout controller
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
