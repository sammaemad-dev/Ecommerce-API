const Order = require("../models/order.model");

const getRevenueStatistics = async () => {
  const stats = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        paidOrdersCount: { $sum: 1 },
        averageOrderValue: { $avg: "$totalPrice" },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      totalRevenue: 0,
      averageOrderValue: 0,
      paidOrdersCount: 0,
    };
  }

  return {
    totalRevenue: Number(stats[0].totalRevenue.toFixed(2)),
    averageOrderValue: Number(stats[0].averageOrderValue.toFixed(2)),
    paidOrdersCount: stats[0].paidOrdersCount,
  };
};


const getOrdersAnalytics = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const defaultStatusBreakdown = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
  };

  stats.forEach((item) => {
    if (item._id in defaultStatusBreakdown) {
      defaultStatusBreakdown[item._id] = item.count;
    }
  });

  return defaultStatusBreakdown;
};


const getTopSellingProducts = async (limit = 5) => {
  return await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        status: { $ne: "cancelled" },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        image: { $first: "$items.image" },
        price: { $first: "$items.price" },
        totalQuantitySold: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.price", "$items.quantity"] },
        },
      },
    },
    {
      $sort: { totalQuantitySold: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: 1,
        image: 1,
        price: 1,
        totalQuantitySold: 1,
        totalRevenue: { $round: ["$totalRevenue", 2] },
      },
    },
  ]);
};


const getOrdersCount = async () => {
  const countStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
        },
      },
    },
  ]);

  if (countStats.length === 0) {
    return {
      totalOrders: 0,
      completedRate: 0,
    };
  }

  const { totalOrders, deliveredOrders } = countStats[0];
  const completedRate = totalOrders > 0
    ? Number(((deliveredOrders / totalOrders) * 100).toFixed(2))
    : 0;

  return {
    totalOrders,
    completedRate,
  };
};


const getSalesSummary = async () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6); 
  start.setHours(0, 0, 0, 0);

  end.setHours(23, 59, 59, 999);

  const stats = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        status: { $ne: "cancelled" },
        paidAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        dailyRevenue: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const salesMap = new Map(stats.map((item) => [item._id, item]));
  const salesSummary = [];
  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    if (salesMap.has(dateStr)) {
      const data = salesMap.get(dateStr);
      salesSummary.push({
        date: dateStr,
        revenue: Number(data.dailyRevenue.toFixed(2)),
        orderCount: data.orderCount,
      });
    } else {
      salesSummary.push({
        date: dateStr,
        revenue: 0,
        orderCount: 0,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return salesSummary;
};


const getDashboardAnalytics = async () => {
  const [
    revenueStatistics,
    ordersAnalytics,
    topSellingProducts,
    ordersCount,
    salesSummary,
  ] = await Promise.all([
    getRevenueStatistics(),
    getOrdersAnalytics(),
    getTopSellingProducts(5),
    getOrdersCount(),
    getSalesSummary(),
  ]);

  return {
    revenueStatistics,
    ordersAnalytics,
    ordersCount,
    topSellingProducts,
    salesSummary,
  };
};

module.exports = {
  getDashboardAnalytics,
};
