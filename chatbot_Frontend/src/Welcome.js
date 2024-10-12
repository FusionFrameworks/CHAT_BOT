// Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Welcome = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className="welcome-container min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-500">
            <h1 className="text-4xl font-bold text-white mb-8">Welcome to CareLink!</h1>
            <div className="flex space-x-4">
                <button
                    onClick={() => navigate('/labtest')} // Navigate to Lab Test page
                    className="px-4 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition duration-200"
                >
                    Lab Test
                </button>
                <button
                    onClick={() => navigate('/chatbot')} // Navigate to Chatbot page
                    className="px-4 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition duration-200"
                >
                    Chatbot
                </button>
            </div>
        </div>
    );
};

export default Welcome;
