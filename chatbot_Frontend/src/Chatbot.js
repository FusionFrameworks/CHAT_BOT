import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify"; // For transitions
import "react-toastify/dist/ReactToastify.css";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [storedSymptoms, setStoredSymptoms] = useState("");
  const [consultationFee, setConsultationFee] = useState(null);
  const chatboxRef = useRef();

  useEffect(() => {
    const welcomeMessage =
      "👋 Welcome to the Health Chatbot! How can I assist you today?";
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
      { text: `You said: ${userInput}`, sender: "user" },
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
        { text: data.message || "No response from server.", sender: "bot" },
      ]);

      const feeMatch = data.message.match(/(?:\d+\.?\d*)/);
      if (feeMatch) {
        setConsultationFee(parseFloat(feeMatch[0]));
      }
    } catch (error) {
      setResponses((prevResponses) => [
        ...prevResponses,
        {
          text: `Error: ${error.message || "Unable to reach the backend."}`,
          sender: "bot",
        },
      ]);
    }

    setUserInput("");
  };

  const handleClearChat = () => {
    window.location.reload();
  };

  const handlePayment = async () => {
    const amount = consultationFee;

    if (isNaN(amount) || amount <= 0) {
      alert("There is an issue with the payment amount.");
      return;
    }

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_lmkOFuIPmT2vi9", // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Health Chatbot Service",
      description: "Chatbot Assistance Payment",
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;

        setResponses((prevResponses) => [
          ...prevResponses,
          {
            text: `Payment successful! Payment ID: ${paymentId}`,
            sender: "bot",
          },
        ]);

        toast.success(
          "Payment Successful! You can now consult with the doctor.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );

        const sessionResponse = await axios.get("/api/auth/get-session");

        if (sessionResponse.status === 200) {
          const { patientId, name } = sessionResponse.data;

          await axios.post("/api/auth/store-payment", {
            paymentId: paymentId,
            status: "completed",
            patientId: patientId,
            name: name,
          });

          const doctorResponse = await fetch(
            "http://127.0.0.1:5000/suggest_doctor",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                symptoms: storedSymptoms,
                payment_status: true,
              }),
            }
          );

          if (!doctorResponse.ok) {
            throw new Error(`Server error: ${doctorResponse.statusText}`);
          }

          const doctorData = await doctorResponse.json();
          setResponses((prevResponses) => [
            ...prevResponses,
            {
              text: doctorData.message || "No response from doctor suggestion.",
              sender: "bot",
            },
          ]);
        } else {
          throw new Error("Session data not found. Please log in first.");
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
        wallet: true,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePaymentFailure = () => {
    toast.error("Payment failed or was canceled. Please try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [responses]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/people-waiting-hospital-reception-while-wearing-medical-masks_23-2148806775.jpg?w=1060&t=st=1728811919~exp=1728812519~hmac=b79e4edd66a7da5c7153bc6b7fc572954a425ce0020f7d178139ec54d61c4877')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-lg"></div>
      </div>
      <div className="chatbot-container w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl border border-gray-200 mt-10 z-10 relative transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          🤖 Health Chatbot
        </h2>
        <div
          className="chatbox border border-gray-300 p-4 h-72 overflow-y-auto rounded-lg bg-gray-100 shadow-inner"
          ref={chatboxRef}
        >
          {responses.map((response, index) => (
            <div
              key={index}
              className={`flex ${
                response.sender === "user" ? "justify-end" : "justify-start"
              } mb-2 animate-fade-in`}
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
            placeholder="Enter your symptoms"
            className="w-full md:w-3/4 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="w-full md:w-1/4 bg-gradient-to-r from-green-400 to-green-600 text-white p-2 rounded-md hover:bg-green-700"
          >
            Send
          </button>
        </div>
        <div className="flex flex-row mt-4 justify-between gap-2">
          {consultationFee !== null && (
            <button
              onClick={handlePayment}
              className="w-full md:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700"
            >
              Proceed with Consultation Payment
            </button>
          )}
          <button
            onClick={handleClearChat}
            className="w-full bg-gradient-to-r bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
