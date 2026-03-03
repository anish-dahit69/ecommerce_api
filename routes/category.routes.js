import express from "express";
import { asyncHandler } from "../lib/asynchandler.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByID,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/productCategory.controller.js";
import { authorizeRoles } from "../middlewares/authorize.js";

export const categoryRouter = express.Router();

categoryRouter.post(
  "/add-category",
  authorizeRoles("admin"),
  asyncHandler(createCategory),
);
categoryRouter.get("/view-categories", asyncHandler(getAllCategories));
categoryRouter.get("/view-category/:id", asyncHandler(getCategoryByID));
(categoryRouter.get(
  "/view-category-by-slug/:slug",
  asyncHandler(getCategoryBySlug),
),
  categoryRouter.delete(
    "/delete-category/:id",
    authorizeRoles("admin"),
    asyncHandler(deleteCategory),
  ),
  categoryRouter.put(
    "/edit-category/:id",
    authorizeRoles("admin"),
    asyncHandler(updateCategory),
  ));
