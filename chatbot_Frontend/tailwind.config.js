/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3d': '0px 4px 6px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'bounce-3d': 'bounce3D 2s infinite',
      },
      keyframes: {
        bounce3D: {
          '0%, 100%': { transform: 'translateY(-5px) scale(1.05)' },
          '50%': { transform: 'translateY(0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
