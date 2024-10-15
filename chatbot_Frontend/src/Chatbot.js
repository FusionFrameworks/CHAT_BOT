import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
    const [userInput, setUserInput] = useState("");
    const [responses, setResponses] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState("");
    const chatboxRef = useRef();

    useEffect(() => {
        const welcomeMessage = "👋 Welcome to the Health Chatbot! How can I assist you today?";
        setResponses([welcomeMessage]);

        const inputField = document.getElementById("user-input");
        if (inputField) {
            inputField.focus();
        }

        // Start speech recognition automatically after welcome message
        startSpeechRecognition();

    }, []);

    const startSpeechRecognition = () => {
        // Check if the browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.log("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Speech recognized: ", transcript);
            setUserInput(transcript);
            handleSend(); // Automatically send the recognized input
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error: ", event.error);
        };

        // Start recognition
        recognition.start();
    };

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
        console.log("User input before sending:", userInput);
        
        if (userInput.trim() === "") {
            alert("Please enter your symptoms before sending.");
            return;
        }

        setResponses((prevResponses) => [...prevResponses, `You said: ${userInput}`]);

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
           console.log(data.message)
            setResponses((prevResponses) => [...prevResponses, data.message || "No response from server."]);
        } catch (error) {
            console.error("Error:", error);
            setResponses((prevResponses) => [...prevResponses, `Error: ${error.message || "Unable to reach the backend."}`]);
        }

        setUserInput(""); 
    };

    const handleClearChat = () => {
        setResponses([]);
        setPaymentAmount(""); 
        const welcomeMessage = "👋 Welcome to the Health Chatbot! How can I assist you today?";
        setResponses([welcomeMessage]);
    };

    const handlePayment = async () => {
        const amount = parseFloat(paymentAmount); 

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid positive amount.");
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
                setResponses((prevResponses) => [
                    ...prevResponses,
                    `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
                ]);

                // Fetch doctor suggestions again after successful payment
                try {
                    const doctorResponse = await fetch("http://127.0.0.1:5000/suggest_doctor", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ symptoms: userInput }),
                    });

                    if (!doctorResponse.ok) {
                        throw new Error(`Server error: ${doctorResponse.statusText}`);
                    }

                    const doctorData = await doctorResponse.json();
                    setResponses((prevResponses) => [
                        ...prevResponses,
                        doctorData.message || "No response from doctor suggestion.",
                    ]);
                } catch (error) {
                    console.error("Error:", error);
                    setResponses((prevResponses) => [
                        ...prevResponses,
                        `Error fetching doctor suggestions: ${error.message}`,
                    ]);
                }
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
                wallet: true     
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
                {/* Payment Input */}
                <div className="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-2">
                    <input
                        type="number"
                        value={paymentAmount}
                        onChange={handlePaymentChange}
                        placeholder="Enter amount to pay"
                        className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 shadow-md hover:shadow-lg"
                        min="0"
                    />
                    <button
                        onClick={handlePayment}
                        className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
