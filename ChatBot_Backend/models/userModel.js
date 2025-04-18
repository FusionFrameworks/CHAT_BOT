const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    mobileNumber: String,
    otp: String,
    otpExpiresAt: Date,
    patientId: { type: String, unique: true },
    paymentId: { type: String, unique: true, sparse: true } // Allow null and enforce uniqueness only when a value is present
});

// Export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;