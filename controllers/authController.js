
// controllers/authController.js

const User = require('../models/userModel');
const twilio = require('twilio');

// Twilio configuration
const accountSid = 'AC0a8e940a64f34356ad286610ab428a7a';
const authToken = '1b3402266036ce109624fa0196be3653';
const client = new twilio(accountSid, authToken);
const twilioServiceSid = 'VAf7c33a2f0e116adbf7da7309e36fd8b7 ';

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

        // Send OTP via Twilio Verify API
        await client.verify.services(twilioServiceSid)
            .verifications
            .create({ to: mobileNumber, channel: 'sms' })
            .then(verification => {
                console.log(`OTP sent to ${mobileNumber}: ${verification.sid}`);
                res.status(200).json({ message: 'OTP sent successfully' });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Failed to send OTP' });
            });
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

        // Verify OTP via Twilio Verify API
        await client.verify.services(twilioServiceSid)
            .verificationChecks
            .create({ to: mobileNumber, code: otp })
            .then(verification_check => {
                if (verification_check.status === 'approved') {
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(400).json({ message: 'Invalid or expired OTP' });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Failed to verify OTP' });
            });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP
};
