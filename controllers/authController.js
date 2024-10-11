// controllers/authController.js

const User = require('../models/userModel');

// Generate OTP helper function
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Registration Handler
const registerUser = async (req, res) => {
    const { name, age, gender, mobileNumber } = req.body;

    try {
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this mobile number already exists' });
        }

        const newUser = new User({
            name,
            age,
            gender,
            mobileNumber
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// OTP Generation Handler
const loginUser = async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        console.log(`OTP sent to ${mobileNumber}: ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// OTP Verification Handler
const verifyOTP = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp === otp && user.otpExpiresAt > new Date()) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP
};
