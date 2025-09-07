// import React from "react";
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="sticky top-0 z-50 w-full text-xl flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-200">
//       <div className="flex items-center gap-2">
//         <span className="font-bold text-gray-800">
//           <span className="font-extrabold">OccasionSuper</span>
//         </span>
//       </div>

//       {/* Center - Nav Links */}
//       <div className="flex gap-8 text-gray-700 font-medium">
//         <Link to="/services" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
//           Services
//         </Link>
//         <Link to="/event-planner" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
//           Event Planner
//         </Link>
//         <Link to="/blog" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
//           Blog
//         </Link>
//         {/* <Link to="/admin" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
//           Admin
//         </Link> */}

//         <Link to="/vendor-auth" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
//           Vendor Portal
//         </Link>

//         {/* <Link to="/vendor" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
//           Vendor Portal
//         </Link> */}
//       </div>

//       <Link
//         to="/login"
//         className="px-4 py-1 border border-[#E69B83] text-[#E69B83] rounded-lg hover:bg-[#E69B83] hover:text-white transition-all hover:shadow-lg hover:shadow-[#E69B83] ease-linear"
//       >
//         Login
//       </Link>
//     </nav>
//   );
// }

// export default Navbar;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">
              <span className="font-extrabold text-lg sm:text-xl">OccasionSuper</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-700 font-medium">
            <Link to="/services" className="hover-global hover:text-shadow hover:scale-110 transition-all ease-linear text-sm lg:text-base">
              Services
            </Link>
            <Link to="/event-planner" className="hover-global hover:text-shadow hover:scale-110 transition-all ease-linear text-sm lg:text-base">
              Event Planner
            </Link>
            <Link to="/blog" className="hover-global hover:text-shadow hover:scale-110 transition-all ease-linear text-sm lg:text-base">
              Blog
            </Link>
            <Link to="/vendor-auth" className="hover-global hover:text-shadow hover:scale-110 transition-all ease-linear text-sm lg:text-base">
              Vendor Portal
            </Link>
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="px-3 lg:px-4 py-1 lg:py-2 text-sm lg:text-base border border-[#E69B83] text-[#E69B83] rounded-lg hover:bg-[#E69B83] hover:text-white transition-all hover:shadow-lg hover:shadow-[#E69B83] ease-linear"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#E69B83] transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                to="/services"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#E69B83] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/event-planner"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#E69B83] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Event Planner
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#E69B83] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/vendor-auth"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#E69B83] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendor Portal
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-[#E69B83] hover:bg-[#E69B83] hover:text-white rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
