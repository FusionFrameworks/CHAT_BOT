
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"; 
import { registerUser, sendOtp, verifyOtp } from "./api";
import Welcome from "./Welcome";
import LabTest from "./LabTest";
import Chatbot from "./Chatbot"; // Import the Chatbot component

function App() {
    const [registerData, setRegisterData] = useState({
        name: "",
        age: "",
        gender: "",
        mobileNumber: "",
    });
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate(); // Use useNavigate hook

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        if (name === "age" && value < 0) return; // Prevent negative age
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleRegister = async () => {
        if (!registerData.name || !registerData.age || !registerData.gender || !registerData.mobileNumber) {
            setMessage("Please fill in all fields to register.");
            return;
        }

        const response = await registerUser({
            ...registerData,
            mobileNumber: `+91${registerData.mobileNumber}`,
        });
        setMessage(response.message);
    };

    const handleSendOtp = async () => {
        const response = await sendOtp(`+91${mobileNumber}`);
        setMessage(response.message);
    };

    const handleVerifyOtp = async () => {
        const response = await verifyOtp(`+91${mobileNumber}`, otp);
        setMessage(response.message);

        if (response.message === "Login successful") {
            setIsLoggedIn(true); // Set login status to true
            navigate("/welcome"); // Navigate to the welcome page after successful login
        }
    };

    // Function to navigate to the Chatbot
    const handleGoToChatbot = () => {
        navigate("/chatbot");
    };

    return (
        <div className="App min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-500">
            <h1 className="text-4xl font-bold text-white mb-8">OTP Authentication</h1>
            <div className="container flex flex-col md:flex-row gap-8 w-full max-w-3xl p-4">
                {/* Registration Form */}
                <div className="form-container bg-white rounded-lg shadow-2xl p-6 flex-1 transition-transform transform hover:scale-105">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Register</h2>
                    <input type="text" name="name" placeholder="Name" value={registerData.name} onChange={handleRegisterChange} className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" />
                    <input type="number" name="age" placeholder="Age" value={registerData.age} onChange={handleRegisterChange} min="0" className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" />
                    <input type="text" name="gender" placeholder="Gender" value={registerData.gender} onChange={handleRegisterChange} className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" />
                    <div className="flex mb-4">
                        <span className="flex items-center p-3 bg-gray-200 border border-gray-300 rounded-l-lg">+91</span>
                        <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={registerData.mobileNumber} onChange={handleRegisterChange} className="w-full p-3 border border-gray-300 rounded-r-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" />
                    </div>
                    <button onClick={handleRegister} className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-105">Register</button>
                </div>

                {/* Login and OTP Verification Form */}
                <div className="form-container bg-white rounded-lg shadow-2xl p-6 flex-1 transition-transform transform hover:scale-105">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Send OTP</h2>
                    <div className="flex mb-4">
                        <span className="flex items-center p-3 bg-gray-200 border border-gray-300 rounded-l-lg">+91</span>
                        <input type="tel" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full p-3 border border-gray-300 rounded-r-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" />
                    </div>
                    <button onClick={handleSendOtp} className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-105">Send OTP</button>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 mt-6">Verify OTP</h2>
                    <input type="number" placeholder="Enter OTP" value={otp} onChange={(e) => { const value = e.target.value; if (value >= 0) setOtp(value); }} className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105" />
                    <button onClick={handleVerifyOtp} className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-105">Verify OTP</button>
                </div>
            </div>

            {/* Message Display */}
            {message && <p className="message-highlight text-center text-white font-bold mt-4">{message}</p>}
        </div>
    );
}

// Wrap the App component with Router for proper context
function AppWrapper() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/labtest" element={<LabTest />} />
                <Route path="/chatbot" element={<Chatbot />} /> {/* Add the Chatbot route */}
            </Routes>
        </Router>
    );
}

export default AppWrapper;
