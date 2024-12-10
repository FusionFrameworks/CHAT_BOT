const mongoose = require("mongoose");

// Payment Schema
const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  patientId: { type: String, required: false },
  name: String,
  amount: Number,
  roomId: { type: Number, required: false },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Export the Payment model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
