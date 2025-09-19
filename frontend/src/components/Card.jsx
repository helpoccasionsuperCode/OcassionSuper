import React from "react";

const Card = ({ image, title, description, price, rating }) => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-40 sm:h-48 md:h-56 object-cover"
        />
        <span className="absolute top-2 left-2 bg-orange-200 text-orange-800 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full">
          OccasionSuper Premium
        </span>
        <span className="absolute top-2 right-2 bg-white text-yellow-500 px-2 py-1 rounded-full text-xs sm:text-sm font-medium shadow">
          ⭐ {rating}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
          {description}
        </p>

        <div className="mt-2 sm:mt-3">
          <p className="text-orange-600 font-bold text-sm sm:text-base">
            ₹{price}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">
            Starting price
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-3 sm:mt-4">
          <button className="text-orange-600 text-xs sm:text-sm hover:underline">
            View Details
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:opacity-90 transition text-xs sm:text-sm">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
