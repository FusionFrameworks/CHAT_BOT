import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
    const [userInput, setUserInput] = useState("");
    const [responses, setResponses] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [storedSymptoms, setStoredSymptoms] = useState("");
    const [consultationFee, setConsultationFee] = useState(null);
    const chatboxRef = useRef();

    useEffect(() => {
        const welcomeMessage = "👋 Welcome to the Health Chatbot! How can I assist you today?";
        setResponses([{ text: welcomeMessage, sender: "bot" }]);
        
        const inputField = document.getElementById("user-input");
        if (inputField) {
            inputField.focus();
        }
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = async () => {
        if (userInput.trim() === "") {
            alert("Please enter your symptoms before sending.");
            return;
        }

        setResponses((prevResponses) => [
            ...prevResponses, 
            { text: `You said: ${userInput}`, sender: "user" }
        ]);
        setStoredSymptoms(userInput);

        try {
            const response = await fetch("http://127.0.0.1:5000/suggest_doctor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ symptoms: userInput }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResponses((prevResponses) => [
                ...prevResponses, 
                { text: data.message || "No response from server.", sender: "bot" }
            ]);

            const feeMatch = data.message.match(/(?:\d+\.?\d*)/);
            if (feeMatch) {
                setConsultationFee(parseFloat(feeMatch[0]));
            }
        } catch (error) {
            setResponses((prevResponses) => [
                ...prevResponses, 
                { text: `Error: ${error.message || "Unable to reach the backend."}`, sender: "bot" }
            ]);
        }

        setUserInput("");
    };

    const handleClearChat = () => {
        setResponses([]);
        setPaymentAmount("");
        setStoredSymptoms("");
        setConsultationFee(null);
        const welcomeMessage = "👋 Welcome to the Health Chatbot! How can I assist you today?";
        setResponses([{ text: welcomeMessage, sender: "bot" }]);
    };

    const handlePayment = async () => {
        const amount = parseFloat(paymentAmount);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid positive amount.");
            return;
        }

        if (consultationFee === null || amount !== consultationFee) {
            alert(`Please enter the correct consultation fee of ₹ ${consultationFee}.`);
            return;
        }

        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Please try again.");
            return;
        }

        const options = {
            key: "rzp_test_lmkOFuIPmT2vi9",
            amount: amount * 100,
            currency: "INR",
            name: "Health Chatbot Service",
            description: "Chatbot Assistance Payment",
            handler: async function (response) {
                const paymentId = response.razorpay_payment_id;
            
                // Display payment success message in chatbot
                setResponses((prevResponses) => [
                    ...prevResponses,
                    { text: `Payment successful! Payment ID: ${paymentId}`, sender: "bot" },
                ]);
            
                // try {
                    // Fetch patientId and name from the session using the get-session API
                    const sessionResponse = await axios.get("http://localhost:5000/api/auth/get-session");
            
                    if (sessionResponse.status === 200) {
                        const { patientId, name } = sessionResponse.data;
            
                        // Send payment ID, patientId, and name to Node.js API
                        await axios.post("http://localhost:5000/api/auth/store-payment", {
                            paymentId: paymentId,
                            status: "completed",
                            patientId: patientId,  // Including patientId
                            name: name             // Including name
                        });
            
                        console.log(`Payment ID ${paymentId} sent successfully to Node.js API.`);
            
                        // Fetch doctor suggestions
                        const doctorResponse = await fetch("http://127.0.0.1:5000/suggest_doctor", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ symptoms: storedSymptoms, payment_status: true }),
                        });
            
                        if (!doctorResponse.ok) {
                            throw new Error(`Server error: ${doctorResponse.statusText}`);
                        }
            
                        const doctorData = await doctorResponse.json();
                        setResponses((prevResponses) => [
                            ...prevResponses,
                            { text: doctorData.message || "No response from doctor suggestion.", sender: "bot" },
                        ]);
                    } else {
                        throw new Error("Session data not found. Please log in first.");
                    }
            
                // } catch (error) {
                //     setResponses((prevResponses) => [
                //         ...prevResponses,
                //         { text: `Error: ${error.message}`, sender: "bot" },
                //     ]);
                //     console.error("Error during payment or doctor suggestion flow:", error);
                // }
            },                    
            prefill: {
                name: "CareLink",
                email: "carelink@gmail.com",
                contact: "9999999999",
                __prefill_vpa: "success@razorpay",
            },
            theme: {
                color: "#3399cc",
            },
            method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true,
            },
        };     

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handlePaymentChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
            setPaymentAmount(value);
        }
    };

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [responses]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://img.freepik.com/free-vector/people-waiting-hospital-reception-while-wearing-medical-masks_23-2148806775.jpg?w=1060&t=st=1728811919~exp=1728812519~hmac=b79e4edd66a7da5c7153bc6b7fc572954a425ce0020f7d178139ec54d61c4877')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-lg"></div>
            </div>
            <div className="chatbot-container w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl border border-gray-200 mt-10 z-10 relative transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">🤖 Health Chatbot</h2>
                <div className="chatbox border border-gray-300 p-4 h-72 overflow-y-auto rounded-lg bg-gray-100 shadow-inner" ref={chatboxRef}>
                    {responses.map((response, index) => (
                        <div
                            key={index}
                            className={`flex ${response.sender === "user" ? "justify-end" : "justify-start"} mb-2 animate-fade-in`}
                        >
                            <div
                                className={`p-3 rounded-2xl max-w-xs shadow-lg ${
                                    response.sender === "user"
                                        ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-br-none"
                                        : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 rounded-bl-none"
                                }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {response.text}
                            </div>
                        </div>
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
                    className="bg-red-600 text-white rounded-lg p-2 mt-2 w-full hover:bg-red-700 transition duration-300 shadow-md"
                >
                    Clear Chat
                </button>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">💳 Make a Payment</h3>
                    <input
                        type="text"
                        value={paymentAmount}
                        onChange={handlePaymentChange}
                        placeholder="Enter consultation fee"
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 shadow-md hover:shadow-lg"
                    />
                    <button
                        onClick={handlePayment}
                        className="bg-green-600 text-white rounded-lg p-2 mt-2 w-full hover:bg-green-700 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;






