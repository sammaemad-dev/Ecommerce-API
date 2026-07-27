const Cart = require("../models/Cart.model");

const getAllCarts = async (page = 1, limit = 10) => {
  const [carts, total] = await Promise.all([
    Cart.find()
      .populate("user", "username email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Cart.countDocuments(),
  ]);

  return {
    carts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

module.exports = {
  getAllCarts,
};
