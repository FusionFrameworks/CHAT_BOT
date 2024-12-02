const express = require("express");
const authController = require("../controllers/authController"); // Ensure correct import
const Notification = require("../models/notificationModel");
const Payment = require("../models/paymentModel");
const paymentController = require("../controllers/paymentController");
const sessionController = require("../controllers/sessionController");

// Import sendNotificationUpdates from utils
const { sendNotificationUpdates } = require("../utils/notificationUtils");

const router = express.Router();

// User Registration Route
router.post("/register", authController.registerUser);

// User Login Route
router.post("/login", authController.loginUser);

// Verify OTP Route with Notification Broadcast
router.post("/verify-otp", async (req, res) => {
  try {
    const response = await authController.verifyOTP(req, res);

    if (response.status === 200) {
      // Broadcast notification upon successful OTP verification
      const notification = {
        name: response.name,
        patientId: response.patientId,
        message: "OTP verification successful",
      };
      sendNotificationUpdates(notification); // Broadcast the notification
    }
  } catch (error) {
    console.error("Error in verify-otp route:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Route to Fetch Notifications
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find();
    const completedPayments = await Payment.find({ status: "completed" });

    const completedPatientIds = new Set(
      completedPayments.map((payment) => payment.patientId)
    );

    const filteredNotifications = notifications.filter((notification) =>
      completedPatientIds.has(notification.patientId)
    );

    const response = filteredNotifications.map((notification) => ({
      patientId: notification.patientId,
      name: notification.name,
    }));

    res.status(200).json({ notifications: response });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Route to Delete Notification by Patient ID
router.post("/notifications/delete", async (req, res) => {
  const { patientId } = req.body;

  try {
    const result = await Notification.deleteMany({ patientId });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ message: `Notifications deleted for patientId: ${patientId}` });
    } else {
      res.status(404).json({
        message: `No notifications found for patientId: ${patientId}`,
      });
    }
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Failed to delete notifications" });
  }
});

// Route for Server-Sent Events (SSE) Notifications Stream
router.get("/notifications/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  global.clients = global.clients || [];
  global.clients.push(newClient);

  res.write(`data: Connected to notifications stream\n\n`);

  req.on("close", () => {
    global.clients = global.clients.filter((client) => client.id !== clientId);
    console.log(`Client ${clientId} disconnected`);
  });
});

router.post("/store-payment", paymentController.storePayment);
router.get("/get-session", sessionController.getSession);

module.exports = router;
