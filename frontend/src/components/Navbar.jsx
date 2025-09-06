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


import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full text-xl flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-800">
          <span className="font-extrabold">OccasionSuper</span>
        </span>
      </div>

      {/* Center - Nav Links */}
      <div className="flex gap-8 text-gray-700 font-medium">
        <Link to="/services" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
          Services
        </Link>
        <Link to="/event-planner" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
          Event Planner
        </Link>
        <Link to="/blog" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
          Blog
        </Link>
        {/* <Link to="/admin" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
          Admin
        </Link> */}

        <Link to="/vendor-auth" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
          Vendor Portal
        </Link>

        {/* <Link to="/vendor" className="hover-global hover:text-shadow hover:scale-110  transition-all ease-linear">
          Vendor Portal
        </Link> */}
      </div>

      <Link
        to="/login"
        className="px-4 py-1 border border-[#E69B83] text-[#E69B83] rounded-lg hover:bg-[#E69B83] hover:text-white transition-all hover:shadow-lg hover:shadow-[#E69B83] ease-linear"
      >
        Login
      </Link>
    </nav>
  );
}

export default Navbar;
