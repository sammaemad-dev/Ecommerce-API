const User = require("../models/user.model");
const getWishlistStats = async () => {
  const stats = await User.aggregate([
    {
      $match: {
        wishList: { $exists: true, $ne: [] },
      },
    },
    
    { $unwind: "$wishList" },
    
    {
      $group: {
        _id: "$wishList",
        wishlistCount: { $sum: 1 },
      },
    },
    
    { $sort: { wishlistCount: -1 } },
    { $limit: 10 },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$product.name",
        price: "$product.price",
        images: "$product.images",
        wishlistCount: 1,
      },
    },
  ]);

  return stats;
};


const getAllWishlists = async (page = 1, limit = 10) => {
  const filter = { wishList: { $exists: true, $ne: [] } };

  const [wishlists, total] = await Promise.all([
    User.find(filter)
      .select("username email wishList")
      .populate("wishList", "name price images")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    wishlists,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

module.exports = {
  getWishlistStats,
  getAllWishlists,
};
