import React, { useState, useEffect } from "react"; // Added useState and useEffect
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify"; // For transitions
import "react-toastify/dist/ReactToastify.css";

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
  const [selectedTest, setSelectedTest] = useState(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setIsPaymentSuccess(false);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentSuccess(true);
    setIsPaymentProcessing(false);
    toast.success("Payment successful! You can now view the test guidelines.", {
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
  

  const handlePaymentFailure = () => {
    setIsPaymentProcessing(false);
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
  

  const initiatePayment = (test) => {
    if (window.Razorpay) {
      setIsPaymentProcessing(true);
      const options = {
        key: "rzp_test_lmkOFuIPmT2vi9",
        amount: parseFloat(test.price.replace("₹", "")) * 100,
        currency: "INR",
        name: "Health App",
        description: "Lab Test Payment",
        handler: (response) => {
          if (response.razorpay_payment_id) {
            handlePaymentSuccess();
          }
        },
        prefill: {
          name: "Test User",
          email: "testuser@example.com",
          contact: "+911234567890",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: handlePaymentFailure,
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } else {
      console.error("Razorpay SDK failed to load.");
      handlePaymentFailure();
    }
  };

  return (
    <div className="p-6 bg-light-gray rounded-lg shadow-2xl">
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
        transition={toast.Bounce}
      />
      <h2 className="text-3xl font-semibold text-soft-blue mb-4">
        Available Lab Tests
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {labTests.map((test, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg shadow-lg transition-transform transform ${
              selectedTest === test
                ? "bg-blue-50 border-blue-500"
                : "hover:scale-105"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-800">{test.name}</h3>
            <p className="text-gray-600">Price: {test.price}</p>
            <button
              className="mt-2 bg-soft-blue text-white px-4 py-2 rounded-lg shadow-lg"
              onClick={() => handleSelectTest(test)}
            >
              View Guidelines
            </button>
            {selectedTest === test && !isPaymentSuccess && (
              <div className="mt-2">
                <h4 className="text-lg font-semibold text-gray-700">
                  Please make a payment to view guidelines:
                </h4>
                <button
                  className={`mt-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg ${
                    isPaymentProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => initiatePayment(test)}
                  disabled={isPaymentProcessing}
                >
                  {isPaymentProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            )}
            {selectedTest === test && isPaymentSuccess && (
              <div className="mt-2">
                <h4 className="text-lg font-semibold text-gray-700">
                  Guidelines:
                </h4>
                <p className="text-gray-600">{test.guidelines}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabTests;
