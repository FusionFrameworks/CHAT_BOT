import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";
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
  const [selectedTests, setSelectedTests] = useState([]);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

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
      prev.includes(test)
        ? prev.filter((t) => t !== test)
        : [...prev, test]
    );
    setIsPaymentSuccess(false);
    setShowGuidelines(false);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentSuccess(true);
    setIsPaymentProcessing(false);
    setShowGuidelines(true);
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

  const initiatePayment = () => {
    if (selectedTests.length === 0) {
      toast.warn("Please select at least one test before proceeding to payment.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    if (window.Razorpay) {
      setIsPaymentProcessing(true);
      const totalAmount = selectedTests.reduce(
        (sum, test) => sum + parseFloat(test.price.replace("₹", "")),
        0
      ) * 100;

      const options = {
        key: "rzp_test_lmkOFuIPmT2vi9",
        amount: totalAmount,
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
    <div className="flex flex-col md:flex-row md:space-x-6 p-6 bg-light-gray rounded-lg shadow-2xl">
      <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-lg">
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
        <h2 className="text-3xl font-semibold text-soft-blue mb-6">
          Available Lab Tests
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {labTests.map((test, index) => (
            <div
              key={index}
              className={`p-6 border rounded-lg shadow-lg transition-transform transform ${
                selectedTests.includes(test)
                  ? "bg-blue-50 border-blue-500"
                  : "hover:scale-105"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-800">{test.name}</h3>
              <p className="text-gray-600">Price: {test.price}</p>
              <button
                className={`mt-2 px-4 py-2 rounded-lg shadow-lg ${
                  selectedTests.includes(test)
                    ? "bg-red-500 text-white"
                    : "bg-soft-blue text-white"
                }`}
                onClick={() => toggleTestSelection(test)}
              >
                {selectedTests.includes(test) ? "Deselect" : "Select"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar for Selected Tests */}
      <div className="w-full md:w-1/4 bg-white shadow-lg p-6 rounded-lg mt-6 md:mt-0">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Selected Tests:</h4>
        <ul className="list-disc list-inside mb-4">
          {selectedTests.map((test, index) => (
            <li key={index} className="text-gray-600">
              {test.name} - {test.price}
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-3 rounded-lg text-white ${
            selectedTests.length > 0 ? "bg-green-500" : "bg-gray-400"
          }`}
          onClick={initiatePayment}
          disabled={selectedTests.length === 0 || isPaymentProcessing}
        >
          {isPaymentProcessing ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>

      {/* Displaying Guidelines After Payment */}
      {showGuidelines && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700">Test Guidelines</h3>
          {selectedTests.map((test, index) => (
            <div key={index} className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-xl font-semibold">{test.name}</h4>
              <p className="text-gray-600">{test.guidelines}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabTests;
