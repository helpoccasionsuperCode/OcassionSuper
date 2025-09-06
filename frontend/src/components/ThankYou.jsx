import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          {/* Success Icon */}
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Our team will contact you soon.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-[#E69B83] text-white rounded-lg hover:bg-[#c16a4d] transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
