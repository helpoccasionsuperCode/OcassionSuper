import React from "react";

const Card = ({ image, title, description, price, rating }) => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-2 left-2 bg-orange-200 text-orange-800 px-3 py-1 text-xs font-medium rounded-full">
          OccasionSuper Premium
        </span>
        <span className="absolute top-2 right-2 bg-white text-yellow-500 px-2 py-1 rounded-full text-sm font-medium shadow">
          ⭐ {rating}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

        <div className="mt-3">
          <p className="text-orange-600 font-bold">₹{price}</p>
          <p className="text-xs text-gray-500">Starting price</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button className="text-orange-600 text-sm hover:underline">
            View Details
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
