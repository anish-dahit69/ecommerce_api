import { AppError } from "../../lib/error.js";
import { addressModel } from "../../models/address.model.js";

//user profile
export const getUserProfile = async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: user,
  });
};

//add address
export const addAddress = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  if (!req.body) {
    throw new AppError(400, "Request body is missing");
  }
  const { address, phone, city, isDefault = false } = req.body;
  if (!address || !phone || !city) {
    throw new AppError(400, "Address, phone and city are required");
  }

  const existingAddress = await addressModel.countDocuments({ user: userId });

  let finalIsDefault = isDefault;
  // If first address → make it default automatically
  if (existingAddress === 0) {
    finalIsDefault = true;
  }

  // If setting as default → remove old default
  if (finalIsDefault) {
    await addressModel.updateMany(
      { user: userId },
      { $set: { isDefault: false } },
    );
  }
  const newAddress = await addressModel.create({
    user: userId,
    address,
    phone,
    city,
    isDefault: finalIsDefault,
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address: newAddress,
  });
};

//get all addresses
export const getAddress = async (req, res) => {
  const address = await addressModel.find();
  if (address.length === 0) throw new AppError(404, "No address found");
  res.status(200).json({
    success: true,
    count: address.length,
    addresses: address,
  });
};

//get address of each user
export const getUserAddress = async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new AppError(401, "Unauthorized");
  const address = await addressModel.find({ user: userId });
  if (address.length === 0)
    throw new AppError(404, "No address found for this user");
  res.status(200).json({
    success: true,
    count: address.length,
    addresses: address,
  });
};

//update address
export const updateAddress = async (req, res) => {
  const addressId = req.params.id;
  const userId = req.user._id;
  if (!userId) throw new AppError(401, "Unauthorized");
  if (!req.body) {
    throw new AppError(400, "Request body is missing");
  }
  const { address, phone, city, isDefault } = req.body;
  if (!address || !phone || !city) {
    throw new AppError(400, "Address, phone and city are required");
  }
  const existingAddress = await addressModel.findOne({
    _id: addressId,
    user: userId,
  });
  if (!existingAddress) {
    throw new AppError(404, "Address not found");
  }
  // 2Handle default logic
  if (isDefault === true) {
    await addressModel.updateMany(
      { user: userId },
      { $set: { isDefault: false } },
    );
  }
  const updatedAddress = await addressModel.findByIdAndUpdate(
    { _id: addressId, user: userId },
    {
      address,
      phone,
      city,
      ...(isDefault !== undefined && { isDefault }),
    },
    { returnDocument: "after" },
  );
  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address: updatedAddress,
  });
};

//delete address
export const deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) throw new AppError(400, "Address ID is required");
  const userId = req.user._id;
  if (!userId) throw new AppError(401, "Unauthorized");
  const deleteAddress = await addressModel.findOneAndDelete({
    _id: addressId,
    user: userId,
  });
  if (!deleteAddress) {
    throw new AppError(404, "Address not found");
  }
  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
};
