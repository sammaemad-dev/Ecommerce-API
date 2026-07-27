require("dotenv").config();

const asyncHandler = require("express-async-handler");
const productService = require("../services/product.service");

const createProduct = asyncHandler(async (req, res) => {
  const result = await productService.createProduct(
    req.validatedData,
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
  const result = await productService.getAllProducts(req.validatedData);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    // data: result,
    ...result, //to merge properties of the object without nesting it under another data key
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const result = await productService.getProductById(req.validatedData.id);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id, ...updateData } = req.validatedData;
  const result = await productService.updateProduct(id, updateData, req.files);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.validatedData.id);

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
