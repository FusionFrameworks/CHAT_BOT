// controllers/authController.js

const User = require('../models/userModel');
const twilio = require('twilio');

// Twilio configuration
const accountSid = 'AC0a8e940a64f34356ad286610ab428a7a'; // Update this with your actual SID
const authToken = 'ebd0cef9ce64fb4c45afd4d38a918be6'; // Update this with your actual Auth Token
const client = new twilio(accountSid, authToken);
const twilioServiceSid = 'VAf7c33a2f0e116adbf7da7309e36fd8b7'; // Update this with your actual Service SID

// Array of Twilio numbers
const twilioNumbers = [
    '+919632983944', // First Twilio number
    '+918804339456', // Second Twilio number
    // Add more numbers as needed
];

// Function to select a Twilio number
const selectTwilioNumber = () => {
    const randomIndex = Math.floor(Math.random() * twilioNumbers.length);
    return twilioNumbers[randomIndex];
};

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
        console.error("Error during registration:", error);
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

        const twilioNumber = selectTwilioNumber();
        console.log(`Selected Twilio number for OTP: ${twilioNumber}`);

        await client.verify.v2.services(twilioServiceSid)
            .verifications
            .create({ to: mobileNumber, channel: 'sms', from: twilioNumber })
            .then(verification => {
                console.log(`OTP sent to ${mobileNumber}: Verification SID ${verification.sid}`);
                res.status(200).json({ message: 'OTP sent successfully' });
            })
            .catch(error => {
                console.error("Error sending OTP:", error);
                res.status(500).json({ message: 'Failed to send OTP', error: error.message });
            });
    } catch (error) {
        console.error("Error during login:", error);
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

        await client.verify.v2.services(twilioServiceSid)
            .verificationChecks
            .create({ to: mobileNumber, code: otp })
            .then(verification_check => {
                if (verification_check.status === 'approved') {
                    console.log(`OTP verified for ${mobileNumber}`);
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    console.log(`Failed OTP verification for ${mobileNumber}`);
                    res.status(400).json({ message: 'Invalid or expired OTP' });
                }
            })
            .catch(error => {
                console.error("Error verifying OTP:", error);
                res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
            });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP
};
