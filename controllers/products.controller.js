import { getUploadURL } from "../lib/upload.js";
import { productModel } from "../models/products.model.js";
import { AppError } from "../lib/error.js";
import APIFeatures from "../lib/APIFeatures.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, imagesURL } = req.body;

    if (!name || !category || !price || !stock || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!req.files) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    // Upload all images to ImageKit
    const imagesUploadPromises = req.files.map((file) =>
      getUploadURL(file.buffer, file.originalname),
    );

    const uploadedImages = await Promise.all(imagesUploadPromises);

    // Get URLs only
    const imgURL = uploadedImages.map((img) => img.url);

    const newProduct = await productModel.create({
      name,
      category,
      price,
      stock,
      description,
      imagesURL: imgURL,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError(400, "Product ID is required");
  const product = await productModel.findOne({ _id: id });
  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
  });
};

// Get all products
export const getProducts = async (req, res) => {
  const productsList = await productModel.find();
  if (!productsList || productsList.length === 0)
    throw new AppError(400, "No products found");

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products: productsList,
  });
};

//delete product by id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError(400, "Product ID is required");
  const deletedProduct = await productModel.findOneAndDelete({ _id: id });
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    product: deletedProduct,
  });
};

//update product by id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, description, removeImages } = req.body;
  if (!id) throw new AppError(400, "Product ID is required");
  const updateData = {};
  const fileds = { name, category, price, stock, description };
  Object.entries(fileds).forEach(([Key, value]) => {
    if (value !== undefined) updateData[Key] = value;
  });

  //Upload new images if sent
  if (req.files && req.files.length > 0) {
    const imagesUploadPromises = req.files.map((files) =>
      getUploadURL(files.buffer, files.originalname),
    );
    const uploadedImagesPromisesResults =
      await Promise.all(imagesUploadPromises);
    const uploadedImagesUrl = uploadedImagesPromisesResults.map(
      (imag) => imag.url,
    );

    updateData.$push = { imagesURL: { $each: uploadedImagesUrl } };
  }

  // Remove images if requested
  if (removeImages && Array.isArray(removeImages)) {
    updateData.$pull = {
      imagesURL: { $in: removeImages },
    };
  }

  //final update
  const updatedProduct = await productModel.findByIdAndUpdate(
    { _id: id },
    updateData,
    { returnDocument: "after" },
  );
  res.status(200).json({
    success: true,
    message: "Product has been updated successfully",
    product: updatedProduct,
  });
};

//search product api

export const searchProduct = async (req, res) => {
  const features = new APIFeatures(productModel.find(), req.query);
  if (!features) throw new AppError(400, "No products found");
  features.search().filter().sort().paginate();
  const products = await features.query;
  const total = await productModel.countDocuments(features.query.getQuery()); // total filtered

  res.status(200).json({
    success: true,
    results: products.length,
    total,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(total / (req.query.limit * 1 || 10)),
    products,
  });
};
