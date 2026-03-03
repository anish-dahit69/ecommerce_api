import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name should be at least 3 characters long"],
    maxLength: [50, "Name should be at most 50 characters long"],
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password should be at least 6 characters long"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    ],
  },
  contact: {
    type: Number,
    required: true,
    match: [
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      "Please fill a valid contact number",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin", "superAdmin"],
    default: "user",
  },
  OTP: {
    type: Number,
    default: "",
  },
  OTPAttempts: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  OTPExpiry: {
    type: Date,
    required: false,
  },
});

export const userModel = mongoose.model("User", userSchema);
