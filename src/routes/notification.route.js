const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");

const notificationController = require("../controllers/notification.controller");

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);

router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markAsRead
);

router.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllAsRead
);

router.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification
);

router.delete(
  "/",
 authMiddleware,
  notificationController.clearNotifications
);

module.exports = router;