// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { Bounce } from "react-toastify"; // For transitions
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "react-toastify/dist/ReactToastify.css";

// const Chatbot = () => {
//   const [userInput, setUserInput] = useState("");
//   const [responses, setResponses] = useState([]);
//   const [storedSymptoms, setStoredSymptoms] = useState("");
//   const [consultationFee, setConsultationFee] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState(false); // New state for payment status
//   const chatboxRef = useRef();
//   const navigate = useNavigate(); // Initialize navigate

//   useEffect(() => {
//     const welcomeMessage =
//       "👋 Welcome to the Health Chatbot! How can I assist you today?";
//     setResponses([{ text: welcomeMessage, sender: "bot" }]);

//     const inputField = document.getElementById("user-input");
//     if (inputField) {
//       inputField.focus();
//     }
//   }, []);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const handleUserInput = (e) => {
//     setUserInput(e.target.value);
//   };

//   const handleSend = async () => {
//     if (userInput.trim() === "") {
//       alert("Please enter your symptoms before sending.");
//       return;
//     }

//     setResponses((prevResponses) => [
//       ...prevResponses,
//       { text: `You said: ${userInput}`, sender: "user" },
//     ]);
//     setStoredSymptoms(userInput);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/suggest_doctor", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ symptoms: userInput }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResponses((prevResponses) => [
//         ...prevResponses,
//         { text: data.message || "No response from server.", sender: "bot" },
//       ]);

//       const feeMatch = data.message.match(/(?:\d+\.?\d*)/);
//       if (feeMatch) {
//         setConsultationFee(parseFloat(feeMatch[0]));
//       }
//     } catch (error) {
//       setResponses((prevResponses) => [
//         ...prevResponses,
//         {
//           text: `Error: ${error.message || "Unable to reach the backend."}`,
//           sender: "bot",
//         },
//       ]);
//     }

//     setUserInput("");
//   };

//   const handleClearChat = () => {
//     window.location.reload();
//   };

//   const handlePayment = async () => {
//     const amount = consultationFee;

//     if (isNaN(amount) || amount <= 0) {
//       alert("There is an issue with the payment amount.");
//       return;
//     }

//     const res = await loadRazorpayScript();

//     if (!res) {
//       alert("Razorpay SDK failed to load. Please try again.");
//       return;
//     }

//     const options = {
//       key: "rzp_test_lmkOFuIPmT2vi9", // Replace with your Razorpay key
//       amount: amount * 100, // Amount in paise
//       currency: "INR",
//       name: "Health Chatbot Service",
//       description: "Chatbot Assistance Payment",
//       handler: async function (response) {
//         const paymentId = response.razorpay_payment_id;

//         setResponses((prevResponses) => [
//           ...prevResponses,
//           {
//             text: `Payment successful! Payment ID: ${paymentId}`,
//             sender: "bot",
//           },
//         ]);

//         toast.success(
//           "Payment Successful! You can now consult with the doctor.",
//           {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "colored",
//             transition: Bounce,
//           }
//         );

//         const sessionResponse = await axios.get("/api/auth/get-session");

//         if (sessionResponse.status === 200) {
//           const { patientId, name } = sessionResponse.data;

//           await axios.post("/api/auth/store-payment", {
//             paymentId: paymentId,
//             status: "completed",
//             patientId: patientId,
//             name: name,
//           });

//           const doctorResponse = await fetch(
//             "http://127.0.0.1:5000/suggest_doctor",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 symptoms: storedSymptoms,
//                 payment_status: true,
//               }),
//             }
//           );

//           if (!doctorResponse.ok) {
//             throw new Error(`Server error: ${doctorResponse.statusText}`);
//           }

//           const doctorData = await doctorResponse.json();
//           setResponses((prevResponses) => [
//             ...prevResponses,
//             {
//               text: doctorData.message || "No response from doctor suggestion.",
//               sender: "bot",
//             },
//           ]);
//         } else {
//           throw new Error("Session data not found. Please log in first.");
//         }

//         // Set payment status to true (successful)
//         setPaymentStatus(true);
//       },
//       prefill: {
//         name: "CareLink",
//         email: "carelink@gmail.com",
//         contact: "9999999999",
//         __prefill_vpa: "success@razorpay",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//       method: {
//         upi: true,
//         card: true,
//         netbanking: true,
//         wallet: true,
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//   };

//   const handlePaymentFailure = () => {
//     toast.error("Payment failed or was canceled. Please try again.", {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//       transition: Bounce,
//     });

//     // Set payment status to false (failed)
//     setPaymentStatus(false);
//   };

//   useEffect(() => {
//     if (chatboxRef.current) {
//       chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
//     }
//   }, [responses]);

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//         transition={Bounce}
//       />
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://img.freepik.com/free-vector/people-waiting-hospital-reception-while-wearing-medical-masks_23-2148806775.jpg?w=1060&t=st=1728811919~exp=1728812519~hmac=b79e4edd66a7da5c7153bc6b7fc572954a425ce0020f7d178139ec54d61c4877')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-lg"></div>
//       </div>
//       <div className="chatbot-container w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl border border-gray-200 mt-10 z-10 relative transform transition-transform duration-300 hover:scale-105">
//         <div className="flex flex-col items-center mb-4">
//           <button
//             onClick={() => navigate("/welcome")}
//             className="absolute left-4 flex items-center text-gray-600 hover:text-gray-800"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="2"
//               stroke="currentColor"
//               className="w-6 h-6 mr-2"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           <h2 className="text-2xl font-semibold text-gray-800">
//             🤖 Health Chatbot
//           </h2>
//         </div>
//         <div className="chat-box max-h-[50%] overflow-y-auto" ref={chatboxRef}>
//           {responses.map((response, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 response.sender === "user" ? "justify-end" : "justify-start"
//               } mb-2`}
//             >
//               <div
//                 className={`px-4 py-2 rounded-lg max-w-xs ${
//                   response.sender === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-300 text-black"
//                 }`}
//               >
//                 {response.text}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex mt-4 space-x-4">
//           <input
//             type="text"
//             id="user-input"
//             value={userInput}
//             onChange={handleUserInput}
//             className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
//             placeholder="Enter your symptoms"
//           />
//           <button
//             onClick={handleSend}
//             className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
//           >
//             Send
//           </button>
//         </div>
//         {consultationFee && consultationFee > 0 && !paymentStatus && (
//           <div className="mt-4">
//             <button
//               onClick={handlePayment}
//               className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded-lg hover:bg-green-700"
//             >
//               Pay ₹{consultationFee} for Consultation
//             </button>
//           </div>
//         )}
//         <button
//           onClick={handleClearChat}
//           className="w-full bg-red-600 text-white p-2 rounded-lg mt-4 hover:bg-red-700"
//         >
//           Clear Chat
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify"; // For transitions
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [storedSymptoms, setStoredSymptoms] = useState("");
  const [consultationFee, setConsultationFee] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false); // New state for payment status
  const chatboxRef = useRef();
  const navigate = useNavigate(); // Initialize navigate

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

        try {
          const sessionResponse = await axios.get("/api/auth/get-session");

          if (sessionResponse.status === 200) {
            const { patientId, name } = sessionResponse.data;

            // Fetch doctor details after successful payment
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

            // Extract Room Number if available
            const roomId = doctorData.message.match(/Room Number: (\d+)/)?.[1];

            // Store the payment with Room Number
            await axios.post("/api/auth/store-payment", {
              paymentId: paymentId,
              status: "completed",
              patientId: patientId,
              name: name,
              roomId: roomId || "N/A", // Use "N/A" if Room Number is not provided
            });

            setResponses((prevResponses) => [
              ...prevResponses,
              {
                text:
                  doctorData.message || "No response from doctor suggestion.",
                sender: "bot",
              },
            ]);
          } else {
            throw new Error("Session data not found. Please log in first.");
          }

          // Set payment status to true (successful)
          setPaymentStatus(true);
        } catch (error) {
          setResponses((prevResponses) => [
            ...prevResponses,
            {
              text: `Error: ${
                error.message || "Unable to complete the process."
              }`,
              sender: "bot",
            },
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

    // Set payment status to false (failed)
    setPaymentStatus(false);
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
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={() => navigate("/welcome")}
            className="absolute left-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            🤖 Health Chatbot
          </h2>
        </div>
        <div className="chat-box max-h-[50%] overflow-y-auto" ref={chatboxRef}>
          {responses.map((response, index) => (
            <div
              key={index}
              className={`flex ${
                response.sender === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  response.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {response.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-4 space-x-4">
          <input
            type="text"
            id="user-input"
            value={userInput}
            onChange={handleUserInput}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter your symptoms"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
        {consultationFee && consultationFee > 0 && !paymentStatus && (
          <div className="mt-4">
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
              Pay ₹{consultationFee} for Consultation
            </button>
          </div>
        )}
        <button
          onClick={handleClearChat}
          className="w-full bg-red-600 text-white p-2 rounded-lg mt-4 hover:bg-red-700"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
