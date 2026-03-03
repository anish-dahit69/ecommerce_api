import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { upload } from "../lib/multer.js";
import { asyncHandler } from "../lib/asynchandler.js";
import { authorizeRoles } from "../middlewares/authorize.js";

export const productRouter = express.Router();

productRouter.post(
  "/add-product",
  authorizeRoles("admin"),
  upload.array("images", 5),
  createProduct,
);
productRouter.get("/view-products/:id", asyncHandler(getProductById));
productRouter.get("/view-products", asyncHandler(getProducts));
productRouter.patch(
  "/edit-product/:id",
  authorizeRoles("admin"),
  upload.array("images", 5),
  asyncHandler(updateProduct),
);
productRouter.delete(
  "/delete-product/:id",
  authorizeRoles("admin"),
  asyncHandler(deleteProduct),
);
productRouter.get("/search", asyncHandler(searchProduct));
