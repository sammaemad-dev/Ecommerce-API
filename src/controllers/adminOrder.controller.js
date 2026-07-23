const Order = require("../models/order.model");
const User = require("../models/user.model");


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
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



const filterOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      paymentMethod,
      user,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;

    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (user) filter.user = user;

    const orders = await Order.find(filter)
      .populate("user", "username email")
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


const searchOrders = async (req, res) => {
  try {

    const keyword = req.query.keyword?.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    // const orders = await Order.find({
    //   $or: [
    //     {
    //       "shippingAddress.fullName": {
    //         $regex: keyword,
    //         $options: "i",
    //       },
    //     },
    //     {
    //       "shippingAddress.phone": {
    //         $regex: keyword,
    //         $options: "i",
    //       },
    //     },
    //   ],
    // }).populate({
    //   path: "user",
    //   select: "username email",
    //   match: {
    //     $or: [
    //       { username: { $regex: keyword, $options: "i" } },
    //       { email: { $regex: keyword, $options: "i" } },
    //     ],
    //   },
    // });

    // const result = orders.filter(
    //   order =>
    //     order.user ||
    //     order.shippingAddress.fullName
    //       .toLowerCase()
    //       .includes(keyword.toLowerCase()) ||
    //     order.shippingAddress.phone.includes(keyword)
    // );

    // res.status(200).json({
    //   success: true,
    //   count: result.length,
    //   orders: result,
    // });

    //the New logic

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
      { paymentStatus: { $regex: keyword, $options: "i" } }
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


const allowedStatus = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const updateOrderStatus = async (req, res) => {

  try {

    const { status, adminNote } = req.body;

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    order.status = status;

    if (adminNote) {
      order.adminNote = adminNote;
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

}


module.exports = {
  getAllOrders,
  filterOrders,
  searchOrders,
  updateOrderStatus,
};