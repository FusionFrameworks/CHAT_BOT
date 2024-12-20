import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const labTests = [
  {
    name: "Blood Test",
    price: "₹740",
    guidelines:
      "Avoid eating or drinking anything except water for at least 8 hours before the test.",
  },
  {
    name: "Urine Test",
    price: "₹660",
    guidelines:
      "Make sure the urine sample is collected in a clean container. Avoid consuming caffeine or alcohol before the test.",
  },
  {
    name: "X-Ray",
    price: "₹1500",
    guidelines:
      "Wear loose, comfortable clothing and remove any metal objects such as jewelry, belts, or glasses.",
  },
  {
    name: "MRI Scan",
    price: "₹5000",
    guidelines:
      "Avoid wearing metal items. Inform the technician if you have any implants or medical devices.",
  },
  {
    name: "CT Scan",
    price: "₹4500",
    guidelines:
      "You may be required to fast for a few hours before the test. Inform the technician if you are pregnant or breastfeeding.",
  },
  {
    name: "ECG (Electrocardiogram)",
    price: "₹1000",
    guidelines:
      "Avoid oily skin lotions or creams. Wear loose-fitting clothes to expose your chest area.",
  },
  {
    name: "Echocardiogram",
    price: "₹3000",
    guidelines:
      "Do not eat a heavy meal at least 2 hours before the test. Wear loose clothing to allow easy access to your chest area.",
  },
  {
    name: "Lung Function Test",
    price: "₹2500",
    guidelines:
      "Avoid strenuous activity and heavy meals before the test. You may be asked to withhold medications for a certain period.",
  },
  {
    name: "Liver Function Test",
    price: "₹1500",
    guidelines:
      "Do not drink alcohol for 24 hours before the test. You may be asked to fast for 8–12 hours prior to the test.",
  },
  {
    name: "Kidney Function Test",
    price: "₹2200",
    guidelines:
      "Stay hydrated before the test. Avoid heavy exercise and consult with your doctor regarding any medications you are on.",
  },
  {
    name: "Thyroid Function Test",
    price: "₹1800",
    guidelines:
      "Avoid taking any thyroid medications before the test. Fasting for 8–12 hours may be required.",
  },
  {
    name: "Pregnancy Test",
    price: "₹500",
    guidelines:
      "For the urine test, collect the first morning urine sample. For blood tests, consult your doctor.",
  },
  {
    name: "Vitamin D Test",
    price: "₹1200",
    guidelines:
      "There are no specific preparations required. However, avoid taking supplements right before the test.",
  },
  {
    name: "Diabetes Test (Blood Sugar Test)",
    price: "₹650",
    guidelines:
      "Fast for at least 8 hours before the test, and avoid drinking sugary beverages.",
  },
];

const LabTests = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleTestSelection = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const initiatePayment = () => {
    if (selectedTests.length === 0) {
      toast.warn(
        "Please select at least one test before proceeding to payment.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );
      return;
    }
  
    // Total cost calculation
    const totalAmount = selectedTests.reduce(
      (sum, test) => sum + parseFloat(test.price.replace("₹", "")),
      0
    );
  
    // Extracting test names
    const testNames = selectedTests.map((test) => test.name).join(", ");
  
    // Razorpay options for the payment
    const options = {
      key: "rzp_test_lmkOFuIPmT2vi9", // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise (₹1 = 100 paise)
      currency: "INR",
      name: "CareLink Labs",
      description: "Payment for selected lab tests",
      image: "https://your-logo-url.com/logo.png", // Optional logo image
      handler: function (response) {
        // Success Toast
        toast.success("Payment successful! Thank you for your payment.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setPaymentSuccess(true); // Show the guidelines card after payment success
  
        // Call the Twilio Notification API
        fetch("https://l7xqlqhl-4000.inc1.devtunnels.ms/send-notification", { // http://127.0.0.1:4000 for local host
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: "+918804339456", // Replace with dynamic user's phone number
            message: `Your payment was successful! You can now view the test guidelines for: ${testNames}`,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log("Notification sent successfully.");
            } else {
              console.error("Failed to send notification:", data.error);
            }
          })
          .catch((error) => console.error("Error sending notification:", error));
      },
      prefill: {
        name: "CareLink",
        email: "carelink@gmail.com",
        contact: "9999999999",
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
  
    const rzp1 = new window.Razorpay(options);
    rzp1.open(); // Open the Razorpay checkout modal
    setIsPaymentProcessing(true); // Set payment processing state
  
    rzp1.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setIsPaymentProcessing(false); // Reset payment processing state
    });
  };
  
  const totalCost = selectedTests.reduce(
    (sum, test) => sum + parseFloat(test.price.replace("₹", "")),
    0
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-6 bg-light-gray rounded-lg shadow-2xl">
      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-lg">
        <ToastContainer />
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={() => navigate("/welcome")}
            className="absolute left-10 flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
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
          <h2 className="text-3xl font-semibold text-soft-blue mb-6 underline">
            Available Lab Tests
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {labTests.map((test, index) => (
            <div
              key={index}
              className={`p-6 border rounded-lg shadow-lg transition-transform transform ${
                selectedTests.includes(test)
                  ? "bg-blue-50 border-blue-500"
                  : "hover:scale-105"
              }`}
            >
              <h3 className="text-xl font-bold">{test.name}</h3>
              <p className="text-gray-600">Price: {test.price}</p>
              <button
                className={`mt-2 px-4 py-2 rounded-lg ${
                  selectedTests.includes(test)
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
                onClick={() => toggleTestSelection(test)}
              >
                {selectedTests.includes(test) ? "Deselect" : "Select"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow-lg p-6 rounded-lg md:ml-6 mt-6 md:mt-0 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-semibold mb-4">Selected Tests:</h4>
          {selectedTests.length === 0 ? (
            <p>No tests selected</p>
          ) : (
            <div className="flex flex-col space-y-4">
              {selectedTests.map((test, index) => (
                <div
                  key={index}
                  className="w-full p-4 border rounded-lg shadow-md bg-gray-100"
                >
                  <h4 className="text-lg font-bold">{test.name}</h4>
                  <p className="text-gray-600">Price: {test.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        

        {/* Total Cost and Payment Button */}
        {selectedTests.length > 0 && (
          <div className="mt-4 flex flex-col items-start space-y-2">
            <div className="p-3 bg-gray-200 rounded-lg w-full">
              <h4 className="text-sm font-bold text-gray-700">Total Cost:</h4>
              <p className="text-lg font-semibold text-gray-800">
                ₹{totalCost}
              </p>
            </div>
            <button
              className={`w-full py-3 rounded-lg text-white ${
                selectedTests.length > 0 ? "bg-green-500" : "bg-gray-400"
              }`}
              onClick={initiatePayment}
              disabled={isPaymentProcessing}
            >
              {isPaymentProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        )}
      </div>
      

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[75%] md:w-[50%]">
            <h3 className="text-xl font-semibold mb-4 underline text-soft-blue">
              Test Guidelines
            </h3>
            <div>
              {selectedTests.map((test, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-bold">{test.name}</h4>
                  <p className="text-gray-600">{test.guidelines}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setPaymentSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
  
};

export default LabTests;



