const Order = require("../models/order.model");
const User = require("../models/user.model");
const getAllOrders = async (req, res) => {
  try {
    
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("items.product", "title price images")
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
      .populate("user", "firstName lastName email")
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

// const searchOrders = async (req, res) => {
//   try {

//     const keyword = req.query.keyword?.trim();

//     if (!keyword) {
//       return res.status(400).json({
//         success: false,
//         message: "Search keyword is required",
//       });
//     }

//     const orders = await Order.find({
//       $or: [
//         {
//           "shippingAddress.fullName": {
//             $regex: keyword,
//             $options: "i",
//           },
//         },
//         {
//           "shippingAddress.phone": {
//             $regex: keyword,
//             $options: "i",
//           },
//         },
//       ],
//     }).populate({
//       path: "user",
//       match: {
//         $or: [
//           { firstName: { $regex: keyword, $options: "i" } },
//           { lastName: { $regex: keyword, $options: "i" } },
//           { email: { $regex: keyword, $options: "i" } },
//         ],
//       },
//     });

//     const result = orders.filter(
//       order =>
//         order.user ||
//         order.shippingAddress.fullName
//           .toLowerCase()
//           .includes(keyword.toLowerCase()) ||
//         order.shippingAddress.phone.includes(keyword)
//     );

//     res.status(200).json({
//       success: true,
//       count: result.length,
//       orders: result,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

const searchOrders = async (req, res) => {
  try {
    const { keyword } = req.validatedData;

    // Find users matching the keyword
    const users = await User.find({
      $or: [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    }).select("_id");

    const userIds = users.map((user) => user._id);

    // Search orders
    const orders = await Order.find({
      $or: [
        { user: { $in: userIds } },
        {
          "shippingAddress.fullName": {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          "shippingAddress.phone": {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .populate("user", "firstName lastName email")
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

    // if (!allowedStatus.includes(status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid order status",
    //   });
    // }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!allowedTransitions[order.status].includes(status)) {  // Prevent invalid status transitions
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from "${order.status}" to "${status}".`,
      });
    }
    order.status = status;
    if (adminNote) {
      order.adminNote = adminNote;
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    if (status === "cancelled" && !order.cancelledAt) {
      order.cancelledAt = new Date();
    }
    await order.save();
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
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
};
