const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/paymentModel");

// Twilio configuration
const client = new twilio(
  "AC9d1139ae2a944f7479c5c223090bea41",
  "24fa24a750f2ce88ef031bae5099d6a5"
);
const twilioServiceSid = "VAde186a6179f21610b2d8648c0c160ae6";

// Helper function to select a Twilio number
const selectTwilioNumber = () => {
  const twilioNumbers = ["+919632983944", "+918804339456","+919481680079","+919743352610"];
  return twilioNumbers[Math.floor(Math.random() * twilioNumbers.length)];
};

// Registration Handler
const registerUser = async (req, res) => {
  const { name, age, gender, mobileNumber } = req.body;

  try {
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const patientId = uuidv4();
    const newUser = new User({ name, age, gender, mobileNumber, patientId });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", patientId });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and send OTP using Twilio
    const twilioNumber = selectTwilioNumber();
    await client.verify.v2.services(twilioServiceSid).verifications.create({
      to: mobileNumber,
      channel: "sms",
      from: twilioNumber,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// OTP Verification and Login
const verifyOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    // Find the user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP using Twilio
    const verificationCheck = await client.verify.v2
      .services(twilioServiceSid)
      .verificationChecks.create({ to: mobileNumber, code: otp });

    if (verificationCheck.status === "approved") {
      // Create a session and store patientId and name
      req.session.user = {
        patientId: user.patientId,
        name: user.name,
      };

      // Create a new notification entry (if required, but not necessary for real-time communication)
      const newNotification = new Notification({
        name: user.name,
        patientId: user.patientId,
      });

      await newNotification.save();

      // Respond with success
      return res.status(200).json({
        message: "Login successful",
        name: user.name,
        patientId: user.patientId,
      });
    } else {
      // Handle invalid or expired OTP
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    // Ensure only one response is sent in case of error
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to verify OTP" });
    }
  }
};

// Fetch Notifications
const getNotifications = async (req, res) => {
  try {
    // Fetch all notifications
    const notifications = await Notification.find();

    // Get completed payments based on payment status
    const completedPayments = await Payment.find({ status: "completed" });

    // Create a Set of patientIds with completed payments for faster lookup
    const completedPatientIds = new Set(
      completedPayments.map((payment) => payment.patientId)
    );

    // Filter notifications to include only those with completed payments
    const filteredNotifications = notifications.filter((notification) =>
      completedPatientIds.has(notification.patientId)
    );

    // Map the filtered notifications to return only relevant details (Patient ID and Name)
    const response = filteredNotifications.map((notification) => ({
      patientId: notification.patientId,
      name: notification.name,
    }));

    res.status(200).json({ notifications: response });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Delete Notifications by Patient ID
const deleteNotificationByPatientId = async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }

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
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  getNotifications,
  deleteNotificationByPatientId,
};
