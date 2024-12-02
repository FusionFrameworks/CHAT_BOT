// // src/api.js
// const API_BASE_URL = 'http://localhost:5000/api/auth';

// export const registerUser = async (userData) => {
//     const response = await fetch(`${API_BASE_URL}/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData)
//     });
//     return response.json();
// };

// export const sendOtp = async (mobileNumber) => {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mobileNumber })
//     });
//     return response.json();
// };

// export const verifyOtp = async (mobileNumber, otp) => {
//     const response = await fetch(`${API_BASE_URL}/verify-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mobileNumber, otp })
//     });
//     return response.json();
// };

// src/api.js
const API_BASE_URL = "/api/auth"; // Relative URL for auth APIs
const DOCTOR_API_BASE_URL = "http://127.0.0.1:5000/suggest_doctor"; // Assuming your doctor suggestion API is at this base URL

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const sendOtp = async (mobileNumber) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNumber }),
  });
  return response.json();
};

export const verifyOtp = async (mobileNumber, otp) => {
  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNumber, otp }),
  });
  return response.json();
};

// New function to suggest doctors based on symptoms
export const suggestDoctor = async (symptoms, paymentStatus = false) => {
  const response = await fetch(`${DOCTOR_API_BASE_URL}/suggest_doctor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms, payment_status: paymentStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctor suggestions");
  }

  return response.json(); // Return the JSON response
};
