// // api.jsauth
// const API_BASE_URL = 'http://localhost:3000/api/auth/register';

// /**
//  * Registers a new user.
//  * @param {Object} userData - The user data for registration.
//  * @returns {Promise<Object>} - The response from the server.
//  */
// export const registerUser = async (userData) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(userData),
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Registration failed:', error);
//         return { message: 'Registration failed' };
//     }
// };

// /**
//  * Sends an OTP to the user's mobile number.
//  * @param {string} mobileNumber - The user's mobile number.
//  * @returns {Promise<Object>} - The response from the server.
//  */
// export const sendOtp = async (mobileNumber) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ mobileNumber }),
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Sending OTP failed:', error);
//         return { message: 'Sending OTP failed' };
//     }
// };

// /**
//  * Verifies the OTP sent to the user's mobile number.
//  * @param {string} mobileNumber - The user's mobile number.
//  * @param {string} otp - The OTP to verify.
//  * @returns {Promise<Object>} - The response from the server.
//  */
// export const verifyOtp = async (mobileNumber, otp) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/verify-otp`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ mobileNumber, otp }),
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('OTP verification failed:', error);
//         return { message: 'OTP verification failed' };
//     }
// };



// src/api.js
const API_BASE_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

export const sendOtp = async (mobileNumber) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
    });
    return response.json();
};

export const verifyOtp = async (mobileNumber, otp) => {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp })
    });
    return response.json();
};
