const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
const ApiFeatures = require("../utils/apiFeatures");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUtils");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createSubCategory(data, file, userId) {
  const payload = {
    ...data,
    createdBy: userId || data.createdBy,
  };
  if (!payload.name || !payload.category) {
    throw createError("Subcategory name and category are required.", 400);
  }
  const category = await Category.findById(payload.category);
  if (!category) {
    throw createError("Category not found.", 404);
  }
  const existingSubCategory = await SubCategory.findOne({
    name: payload.name,
    category: payload.category,
  });
  if (existingSubCategory) {
    throw createError("Subcategory already exists in this category.", 409);
  }
  if (file) {
    payload.image = await uploadToCloudinary(file.path, "subcategories");
  }
  const subCategory = await SubCategory.create(payload);
  return subCategory;
}

async function getAllSubCategories(query) {
  const subCategoryCount = await SubCategory.countDocuments();
  const features = new ApiFeatures(
    SubCategory.find().populate("category", "name"),
    query,
  )
    .filter()
    .sort()
    .limitFields()
    .search(["name"])
    .pagination(subCategoryCount);
  const subCategories = await features.mongooseQuery;
  return {
    results: subCategories.length,
    pagination: features.paginationResult,
    data: subCategories,
  };
}

async function getSubCategoryById(subCategoryId) {
  const subCategory = await SubCategory.findById(subCategoryId).populate(
    "category",
    "name",
  );
  if (!subCategory) {
    throw createError("Subcategory not found.", 404);
  }
  return subCategory;
}

async function updateSubCategory(subCategoryId, data, file) {
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    throw createError("Subcategory not found.", 404);
  }
  const payload = { ...data };
  if (payload.category) {
    const category = await Category.findById(payload.category);
    if (!category) {
      throw createError("Category not found.", 404);
    }
  }
  const duplicate = await SubCategory.findOne({
    _id: { $ne: subCategoryId },
    name: payload.name || subCategory.name,
    category: payload.category || subCategory.category,
  });
  if (duplicate) {
    throw createError("Subcategory already exists in this category.", 409);
  }
  if (file) {
    const uploadedImage = await uploadToCloudinary(file.path, "subcategories");
    if (subCategory.image?.public_id) {
      try {
        await deleteFromCloudinary(subCategory.image.public_id);
      } catch (err) {
        console.warn(
          `Could not delete old image ${subCategory.image.public_id}:`,
          err.message,
        );
      }
    }
    payload.image = uploadedImage;
  }
  Object.assign(subCategory, payload);
  await subCategory.save();
  return subCategory;
}

async function deleteSubCategory(subCategoryId) {
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    throw createError("Subcategory not found.", 404);
  }
  if (subCategory.image?.public_id) {
    try {
      await deleteFromCloudinary(subCategory.image.public_id);
    } catch (err) {
      console.warn(
        `Could not delete image ${subCategory.image.public_id}:`,
        err.message,
      );
    }
  }
  await subCategory.deleteOne();
}

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
