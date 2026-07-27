const Order = require("../models/order.model");
const User = require("../models/user.model");
const { updateAdminOrderStatus } = require("../services/order.service");
const getAllOrders = async (req, res) => {
  try {
   const { page, limit } = req.validatedData;
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const filterOrders = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      paymentStatus,
      paymentMethod,
      user,
      sort,
      startDate,
      endDate,
    } = req.validatedData;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (user) filter.user = user;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    const orders = await Order.find(filter)
    .populate("user", "username email")
    .populate("items.product", "name price images")
     .sort({ createdAt: sort === "asc" ? 1 : -1 })
     .skip((page - 1) * limit)
     .limit(limit);

    const totalOrders = await Order.countDocuments(filter);
   res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchOrders = async (req, res) => {
  try {
    const { keyword } = req.validatedData;

    const matchingUsers = await User.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ],
    }).select("_id");

    const userIds = matchingUsers.map(user => user._id);

    const orderSearchOr = [
      { user: { $in: userIds } },
      { "shippingAddress.fullName": { $regex: keyword, $options: "i" } },
      { "shippingAddress.phone": { $regex: keyword, $options: "i" } },
      { "shippingAddress.country": { $regex: keyword, $options: "i" } },
      { "shippingAddress.city": { $regex: keyword, $options: "i" } },
      { "shippingAddress.address": { $regex: keyword, $options: "i" } },
      { transactionId: { $regex: keyword, $options: "i" } },
      { status: { $regex: keyword, $options: "i" } },
      { paymentMethod: { $regex: keyword, $options: "i" } },
      { paymentStatus: { $regex: keyword, $options: "i" } },
    ];

    const mongoose = require("mongoose");

    if (mongoose.isValidObjectId(keyword)) {
      orderSearchOr.push({ _id: keyword });
    }

    const orders = await Order.find({ $or: orderSearchOr })
      .populate("user", "username email phone")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id, status, adminNote } = req.validatedData;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from "${order.status}" to "${status}".`,
      });
    }

    const updatedOrder = await updateAdminOrderStatus(
      id,
      status,
      adminNote
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user", "username email phone")
      .populate("items.product", "name price images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getAllOrders,
  filterOrders,
  searchOrders,
  updateOrderStatus,
  getOrderById,
};
