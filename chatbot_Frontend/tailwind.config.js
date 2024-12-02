// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       boxShadow: {
//         '3d': '0px 4px 6px rgba(0, 0, 0, 0.3)',
//       },
//       animation: {
//         'bounce-3d': 'bounce3D 2s infinite',
//       },
//       keyframes: {
//         bounce3D: {
//           '0%, 100%': { transform: 'translateY(-5px) scale(1.05)' },
//           '50%': { transform: 'translateY(0px) scale(1)' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3d': '0px 4px 6px rgba(0, 0, 0, 0.3)',
        '2xl': '0 10px 30px rgba(0, 0, 0, 0.25)', // Added for button hover effect
      },
      animation: {
        'bounce-3d': 'bounce3D 2s infinite',
        'button-pulse': 'pulse 1.5s infinite', // Added pulse animation for buttons
      },
      keyframes: {
        bounce3D: {
          '0%, 100%': { transform: 'translateY(-5px) scale(1.05)' },
          '50%': { transform: 'translateY(0px) scale(1)' },
        },
        pulse: { // Keyframes for button pulse animation
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3d': '0px 4px 6px rgba(0, 0, 0, 0.3)',
        '2xl': '0 10px 30px rgba(0, 0, 0, 0.25)', // Added for button hover effect
      },
      animation: {
        'bounce-3d': 'bounce3D 2s infinite',
        'button-pulse': 'pulse 1.5s infinite', // Added pulse animation for buttons
        'fade-in': 'fadeIn 1s ease-out', // New fade-in animation for elements
      },
      keyframes: {
        bounce3D: {
          '0%, 100%': { transform: 'translateY(-5px) scale(1.05)' },
          '50%': { transform: 'translateY(0px) scale(1)' },
        },
        pulse: { // Keyframes for button pulse animation
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        fadeIn: { // Keyframes for fade-in effect
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      colors: {
        'soft-blue': '#5A9BD5', // New soft blue color
        'light-gray': '#F5F5F5', // New light gray color
      },
    },
  },
  plugins: [],
};
