const Product = require("../models/product.model");

async function deductStock(productId, quantity, session = null) {
  const options = { new: true };
  if (session) options.session = session;

  const product = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    options,
  );

  if (!product) {
    throw new Error("Insufficient stock or product not found");
  }

  return product;
}

async function restoreStock(productId, quantity, session = null) {
  const options = { new: true };
  if (session) options.session = session;

  const product = await Product.findOneAndUpdate(
    { _id: productId },
    { $inc: { stock: quantity } },
    options,
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

async function updateStock(productId, quantity, session = null) { // للأدمن فقط
  if (quantity < 0) {
    throw new Error("Stock cannot be negative");
  }

  const options = { new: true, runValidators: true };
  if (session) options.session = session;

  const product = await Product.findByIdAndUpdate(
    productId,
    { stock: quantity },
    options,
  );

  if(!product){
    throw new Error("Product not found");
  }

  return product;
}

async function checkStock(productId, quantity, session = null) {
  const queryOptions = {};
  if (session) queryOptions.session = session;

  const product = await Product.findById(productId, null, queryOptions);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Out Of stock");
  }

  return product;
}


module.exports ={
    deductStock,
    restoreStock,
    updateStock,
    checkStock
}
