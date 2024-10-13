
import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
    const [userInput, setUserInput] = useState("");
    const [responses, setResponses] = useState([]);
    const chatboxRef = useRef();

    useEffect(() => {
        // Welcoming message
        const welcomeMessage = "👋 Welcome to the Health Chatbot! How can I assist you today?";
        setResponses([welcomeMessage]);

        // Auto-focus on the input field when the component mounts
        const inputField = document.getElementById("user-input");
        if (inputField) {
            inputField.focus();
        }
    }, []);

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = async () => {
        if (userInput.trim()) {
            setResponses((prevResponses) => [...prevResponses, `You said: ${userInput}`]);

            try {
                const response = await fetch("http://localhost:5000/suggest_doctor", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ symptoms: userInput }),
                });

                const data = await response.json();
                setResponses((prevResponses) => [...prevResponses, data.message]);
            } catch (error) {
                console.error("Error:", error);
                setResponses((prevResponses) => [...prevResponses, "Error: Unable to reach the backend."]);
            }

            setUserInput(""); // Clear input after sending
        }
    };

    const handleClearChat = () => {
        setResponses([]);
        const welcomeMessage = "👋 Welcome to the Health Chatbot! How can I assist you today?";
        setResponses([welcomeMessage]);
    };

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [responses]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image Div */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://img.freepik.com/free-vector/people-waiting-hospital-reception-while-wearing-medical-masks_23-2148806775.jpg?w=1060&t=st=1728811919~exp=1728812519~hmac=b79e4edd66a7da5c7153bc6b7fc572954a425ce0020f7d178139ec54d61c4877')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-lg"></div>
            </div>
            {/* Chatbot Container */}
            <div className="chatbot-container w-full max-w-md p-6 bg-white rounded-lg shadow-2xl border border-gray-200 mt-10 z-10 relative transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">🤖 Health Chatbot</h2>
                <div className="chatbox border border-gray-300 p-4 h-72 overflow-y-auto rounded-lg bg-gray-100 shadow-inner" ref={chatboxRef}>
                    {responses.map((response, index) => (
                        <p key={index} className="mb-2 text-gray-800 transition-all duration-300 transform hover:text-blue-600">
                            {response}
                        </p>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-2">
                    <input
                        id="user-input"
                        type="text"
                        value={userInput}
                        onChange={handleUserInput}
                        placeholder="Type your symptoms..."
                        className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 shadow-md hover:shadow-lg"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Send
                    </button>
                </div>
                <button
                    onClick={handleClearChat}
                    className="bg-red-600 text-white rounded-lg p-2 mt-2 w-full hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-105"
                >
                    Clear Chat
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
