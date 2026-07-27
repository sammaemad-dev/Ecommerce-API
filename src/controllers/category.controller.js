const asyncHandler = require("express-async-handler");
const categoryService = require("../services/category.service");

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(
    req.validatedData,
    req.file,
    req.user?._id,
  );

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories(req.validatedData);

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    ...result,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.validatedData.id);

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id, ...updateData } = req.validatedData;
  const category = await categoryService.updateCategory(
    id,
    updateData,
    req.file,
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.validatedData.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
