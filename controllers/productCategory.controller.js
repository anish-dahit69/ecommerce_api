import { categoryModel } from "../models/category.model.js";
import { AppError } from "../lib/error.js";
import slugify from "slugify";

// Create a new category
export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError(400, "Category name is required");
  const existingCategory = await categoryModel.findOne({ name });
  if (existingCategory) throw new AppError(400, "Category already exists");

  const slug = slugify(name, { lower: true, strict: true });
  const newCategory = await categoryModel.create({
    name,
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category: newCategory,
  });
};

// Get all categories
export const getAllCategories = async (req, res) => {
  const categories = await categoryModel.find();
  if (categories.length === 0) throw new AppError(404, "No categories found");

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    category: categories,
  });
};

// Get a single category by slug
export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  const category = await categoryModel.findOne({ slug });
  if (!category) throw new AppError(404, "Category not found");
  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    category,
  });
};

// Get a single category by ID
export const getCategoryByID = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById({ _id: id });
  if (!category) throw new AppError(404, "Category not found");
  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    category,
  });
};

//delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) throw new AppError(400, "Category ID is required");
  const deletedCategory = await categoryModel.findByIdAndDelete({
    _id: id,
  });
  if (!deletedCategory) throw new AppError(404, "Category not found");
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    deletedCategory,
  });
};

//update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) throw new AppError(400, "Category not found");

  const slug = slugify(name, { lower: true, strict: true });
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug },
    { returnDocument: "after" },
  );
  if (!updatedCategory) throw new AppError(404, "Category not found");
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category: updatedCategory,
  });
};
