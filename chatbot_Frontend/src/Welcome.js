// Welcome.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-blue-500 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 animate-bounce-3d text-center">
        Welcome to <span className="text-shadow-lg">CareLink</span>!
      </h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <button
          onClick={() => navigate("/chatbot")}
          className="w-full sm:w-auto px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-2xl animate-button"
        >
          CHATBOT
        </button>
        <button
          onClick={() => navigate("/labtest")}
          className="w-full sm:w-auto px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-100 hover:shadow-2xl animate-button"
        >
          LAB TEST
        </button>
      </div>
    </div>
  );
};

export default Welcome;
