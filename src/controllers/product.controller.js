require("dotenv").config();

const asyncHandler = require("express-async-handler");
const productService = require("../services/product.service");

const createProduct = asyncHandler(async (req, res) => {
  const result = await productService.createProduct(
    req.validatedData || req.body,
    req.files,
    req.user?._id,
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const result = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const result = await productService.updateProduct(
    req.params.id,
    req.validatedData || req.body,
    req.files,
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
