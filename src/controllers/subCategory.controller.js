const asyncHandler = require("express-async-handler");
const subCategoryService = require("../services/subCategory.service");

const createSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await subCategoryService.createSubCategory(
    req.validatedData,
    req.file,
    req.user?._id,
  );

  res.status(201).json({
    success: true,
    message: "SubCategory created successfully",
    data: subCategory,
  });
});

const getAllSubCategories = asyncHandler(async (req, res) => {
  const result = await subCategoryService.getAllSubCategories(
    req.validatedData,
  );

  res.status(200).json({
    success: true,
    message: "SubCategories retrieved successfully",
    ...result,
  });
});

const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await subCategoryService.getSubCategoryById(
    req.validatedData.id,
  );

  res.status(200).json({
    success: true,
    message: "SubCategory retrieved successfully",
    data: subCategory,
  });
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const { id, ...updateData } = req.validatedData;
  const subCategory = await subCategoryService.updateSubCategory(
    id,
    updateData,
    req.file,
  );

  res.status(200).json({
    success: true,
    message: "SubCategory updated successfully",
    data: subCategory,
  });
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  await subCategoryService.deleteSubCategory(req.validatedData.id);

  res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully.",
  });
});

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
