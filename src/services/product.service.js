const Product = require("../models/product.model");
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

async function createProduct(data, files, userId) {
  const payload = { ...data, createdBy: userId || data.createdBy };
  const categoryId = payload.category;
  const subCategoryId = payload.subCategory;

  if (
    !payload.name ||
    !payload.shortDescription ||
    !payload.description ||
    payload.price === undefined ||
    payload.stock === undefined ||
    payload.category === undefined
  ) {
    throw createError("Missing required product fields", 400);
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw createError("Category not found.", 404);
  }
  if (subCategoryId) {
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      throw createError("Subcategory not found.", 404);
    }
    if (!subCategory.category.equals(category._id)) {
      throw createError(
        "Subcategory does not belong to the selected category.",
        400,
      );
    }
  }

  if (files && files.length > 0) {
    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.path, "products");
      uploadedImages.push(uploaded);
    }

    payload.images = uploadedImages;
  }

  if (!payload.images || payload.images.length === 0) {
    throw createError("At least one product image is required", 400);
  }

  const existingProduct = await Product.findOne({ sku: payload.sku });
  if (payload.sku && existingProduct) {
    throw createError("SKU already exists", 409);
  }

  const product = await Product.create(payload);
  return product;
}

async function getAllProducts(query) {
  // const productCount = await Product.countDocuments({ isActive: true });
  const features = new ApiFeatures(
    Product.find({ isActive: true })
      .populate("category", "name")
      .populate("subCategory", "name"),
    query,
  )
    .filter()
    .sort()
    .limitFields()
    .search(["name", "brand", "description"]);
  // .pagination(productCount);

  const filteredQuery = features.mongooseQuery.clone(); //Aya : counting after filtering
  const productCount = await filteredQuery.countDocuments();

  features.pagination(productCount);

  const products = await features.mongooseQuery;
  return {
    results: products.length,
    pagination: features.paginationResult,
    data: products,
  };
}

async function getProductById(productId) {
  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate("subCategory", "name");

  if (!product) {
    throw createError("Product not found", 404);
  }

  return product;
}

async function updateProduct(productId, data, files) {
  const product = await Product.findById(productId);
  if (!product) {
    throw createError("Product not found", 404);
  }

  const payload = { ...data };
  const categoryId = payload.category || product.category;
  const subCategoryId = payload.subCategory || product.subCategory;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw createError("Category not found.", 404);
  }

  if (subCategoryId) {
    const subCategory = await SubCategory.findById(subCategoryId);

    if (!subCategory) {
      throw createError("Subcategory not found.", 404);
    }
    if (!subCategory.category.equals(categoryId)) {
      throw createError(
        "Subcategory does not belong to the selected category.",
        400,
      );
    }
  }

  if (files && files.length > 0) {
    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.path, "products");
      uploadedImages.push(uploaded);
    }

    payload.images = uploadedImages;
  }

  if (payload.sku) {
    const existingProduct = await Product.findOne({
      sku: payload.sku,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      throw createError("SKU already exists", 409);
    }
  }

  if (payload.images && payload.images.length > 0) {
    const oldImages = product.images || [];
    for (const image of oldImages) {
      if (image?.public_id) {
        try {
          await deleteFromCloudinary(image.public_id);
        } catch (err) {
          console.warn(
            `Could not delete old image ${image.public_id} from Cloudinary:`,
            err.message,
          );
        }
      }
    }
  }

  Object.assign(product, payload);
  await product.save();
  return product;
}

async function deleteProduct(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    throw createError("Product not found", 404);
  }

  for (const image of product.images || []) {
    if (image?.public_id) {
      try {
        await deleteFromCloudinary(image.public_id);
      } catch (err) {
        console.warn(
          `Could not delete image ${image.public_id} from Cloudinary:`,
          err.message,
        );
      }
    }
  }

  // await Product.findByIdAndDelete(productId);
  await product.deleteOne(); //aya: better than findByIdAndDelete to avoid mongoose performs another query
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
