const Notification = require("../models/notification.model");

async function createNotification(
    user,
    title,
    message,
    type = "system"
  ) {
    return await Notification.create({
      user,
      title,
      message,
      type,
    });
  }
  

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function createNotification(user, title, message, type = "system") {
  return await Notification.create({
    user,
    title,
    message,
    type,
  });
}

async function getUserNotifications(userId) {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 });
}

async function markAsRead(id, userId) {
  const notification = await Notification.findOne({
    _id: id,
    user: userId,
  });

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  notification.isRead = true;

  await notification.save();

  return notification;
}

async function markAllAsRead(userId) {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
}

async function deleteNotification(id, userId) {
  const notification = await Notification.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!notification) {
    throw createError("Notification not found", 404);
  }
}

async function clearNotifications(userId) {
  await Notification.deleteMany({
    user: userId,
  });
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
};