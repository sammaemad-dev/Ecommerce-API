const Cart = require("../models/Cart.model");
const Product = require("../models/product.model");

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function findOrCreateCart(userId) {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId });
    }
    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}
function findCartProduct(cart, productId) {
  const item = cart.items.find((item) => item.product.equals(productId));
  return item;
}
async function getCart(userId) {
  const cart = await findOrCreateCart(userId);
  return cart;
}

async function addItem(userId, productId, quantity) {
  if (quantity < 1) throw creatError("Quantity must be at least 1", 400);
  try {
    const product = await Product.findOne(productId);
    if (!product) throw createError("Product Not Found", 404);

    if (!product.isActive) throw createError("Product is inactive", 400);

    if (product.stock < quantity)
      throw createError("Product Out Of Stock", 400);

    const cart = await findOrCreateCart(userId);
    const existingItem = findCartProduct(cart, productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product.id,
        name: product.name,
        image: product.images[0]?.url,
        price:
          product.discountPrice > 0 ? product.discountPrice : product.price,
        quantity,
      });
    }
    product.stock -= quantity;
    await product.save();
    await cart.save();
    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}

async function updateItemQuantity(userId, productId, quantity) {
  if (quantity < 1) throw createError("Quantity must be at least 1", 400);
  try {
    const cart = await findOrCreateCart(userId);

    const product = await Product.findById(productId);
    if (!product) throw createError("Product not found", 404);

    const item = findCartProduct(cart, productId);
    if (!item) throw createError("Item Not in Cart", 404);

    if (!product.isActive) throw createError("Product is inactive", 400);

    const difference = quantity - item.quantity;
    if (difference > 0) {
      if (product.stock < difference)
        throw createError("Product Out Of Stock", 400);
      product.stock -= difference;
    } else {
      product.stock += Math.abs(difference);
    }
    item.quantity = quantity;
    await product.save();
    await cart.save();
    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}

async function removeItem(userId, productId) {
  try {
    const cart = await findOrCreateCart(userId);

    const item = findCartProduct(cart, productId);
    if (!item) throw createError("Item Not in Cart", 404);

    const product = await Product.findById(productId);
    if (!product) throw createError("Product Not Found", 404);

    product.stock += item.quantity;
    cart.items = cart.items.filter((item) => !item.product.equals(productId));

    await product.save();
    await cart.save();
    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}

async function applyCoupon(userId, code, discountType, discountValue) {
  try {
    const cart = await findOrCreateCart(userId);
    if (cart.coupon.code !== null)
      throw createError("Coupon Already Applied", 400);

    cart.coupon = {
      code,
      discountType,
      discountValue,
    };

    await cart.save();

    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}

async function removeCoupon(userId) {
  try {
    const cart = await findOrCreateCart(userId);
    if (cart.coupon.code === null) throw createError("No Coupon Found", 400);
    cart.coupon = {
      code: null,
      discountType: null,
      discountValue: 0,
    };

    await cart.save();

    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}

async function clearCart(userId) {
  try {
    const cart = await findOrCreateCart(userId);
    for (const item of cart.items) {
      let product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    cart.items = [];
    cart.coupon = {
      code: null,
      discountType: null,
      discountValue: 0,
    };
    await cart.save();

    return cart;
  } catch (e) {
    throw createError(e.message, e.statusCode);
  }
}

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
};
