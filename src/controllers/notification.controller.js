const notificationService = require("../services/notification.service.js");

exports.getNotifications = async (req, res) => {
  try {

    const notifications =
      await notificationService.getUserNotifications(req.user._id);

    res.status(200).json({
      success: true,
      notifications,
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.markAsRead = async (req, res) => {
  try {

    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user._id
      );

    res.status(200).json({
      success: true,
      notification,
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.markAllAsRead = async (req, res) => {
  try {

    await notificationService.markAllAsRead(req.user._id);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.deleteNotification = async (req, res) => {
  try {

    await notificationService.deleteNotification(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.clearNotifications = async (req, res) => {
  try {

    await notificationService.clearNotifications(req.user._id);

    res.status(200).json({
      success: true,
      message: "All notifications deleted",
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};