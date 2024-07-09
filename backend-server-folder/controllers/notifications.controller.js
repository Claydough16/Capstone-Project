const express = require("express");
const router = express.Router();
const validateSession = require("../middleware/validate.session");
const Notification = require("../models/notifications.model");

router.get("/messages", validateSession, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userName })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("message createdAt");
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Get the count of unread notifications
router.get("/unread", validateSession, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.userName,
      read: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch unread notifications count" });
  }
});

//  Mark notifications as read
router.patch("/read", validateSession, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userName, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

// Clear all notifications
router.delete("/clear", validateSession, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.userName });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

module.exports = router;
