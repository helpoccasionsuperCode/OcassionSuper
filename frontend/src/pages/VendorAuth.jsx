// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Quote from "../components/Quote"
// import WhyChooseUs from "../components/WhyChooseUs";
// import Register from "../components/VendorRegister/Register"
// import Login from "../components/Login"

// const VendorReg = () => {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: (
//         <div className="text-global text-2xl">
//           <div className="relative">
//             <span className="text-3xl">1</span>
//           </div>
//         </div>
//       ),
//       title: "Guaranteed Business Opportunities",
//       description: (
//         <ul className="list-disc pl-5 space-y-1">
//           <li>Har mahine verified leads aur high-value clients</li>
//           <li>
//             Weddings, birthdays, anniversaries, corporate parties, exhibitions
//             aur sab categories covers
//           </li>
//         </ul>
//       ),
//     },
//     {
//       icon: (
//         <div className="text-global text-2xl">
//           <div className="relative">
//             <span className="text-3xl">2</span>
//           </div>
//         </div>
//       ),
//       title: "Hassle-Free Vendor Experience",
//       description: (
//         <ul className="list-disc pl-5 space-y-1">
//           <li>
//             Client communication, negotiations aur requirements OccasionSuper
//             handle karega
//           </li>
//           <li>Aapko sirf service deliver karni hai - baaki kaam hum sambhalte hain</li>
//         </ul>
//       ),
//     },
//     {
//       icon: (
//         <div className="text-global text-2xl">
//           <div className="relative">
//             <span className="text-3xl">3</span>
//           </div>
//         </div>
//       ),
//       title: "On-Time & Secure Payments",
//       description: (
//         <ul className="list-disc pl-5 space-y-1">
//           <li>Advance payment confirmation</li>
//           <li>
//             OccasionSuper ke through secured, transparent aur time-bound payments
//           </li>
//         </ul>
//       ),
//     },
//     {
//       icon: (
//         <div className="text-global text-2xl">
//           <div className="relative">
//             <span className="text-3xl">4</span>
//           </div>
//         </div>
//       ),
//       title: "Increased Online Visibility",
//       description: (
//         <ul className="list-disc pl-5 space-y-1">
//           <li>
//             OccasionSuper par listing se aapki brand visibility multiple cities
//             me badhegi
//           </li>
//           <li>Aapke business ka digital presence hum manage karte hain</li>
//         </ul>
//       ),
//     },
//     {
//       icon: (
//         <div className="text-global text-2xl">
//           <div className="relative">
//             <span className="text-3xl">5</span>
//           </div>
//         </div>
//       ),
//       title: "End-to-End Event Management",
//       description: (
//         <ul className="list-disc pl-5 space-y-1">
//           <li>Aapko sirf apna kaam deliver karna hota hai</li>
//           <li>
//             Planning, coordination, execution aur client satisfaction ka zimma
//             OccasionSuper ka
//           </li>
//         </ul>
//       ),
//     },
//     {
//       icon: (
//         <div className="text-global text-2xl">
//           <div className="relative">
//             <span className="text-3xl">6</span>
//           </div>
//         </div>
//       ),
//       title: "Zero Marketing Cost",
//       description: (
//         <ul className="list-disc pl-5 space-y-1">
//           <li>Aapko advertising ya marketing me paisa kharch nahi karna</li>
//           <li>Hum aapko directly interested customers tak le aate hain</li>
//         </ul>
//       ),
//     },
//   ];

//   return (
//     <>
//       <section className="relative w-full h-screen flex items-center justify-center bg-gray-100">
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
//             alt="Background"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/30"></div>
//         </div>

//         <div className="relative z-10 w-[90%] max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//           {/* Left Section - Marketing Content */}
//           <div className="text-white md:pr-8">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6">
//               Grow your business with us!
//             </h1>
//             <ul className="space-y-3 mb-6 text-lg">
//               <li>• Showcase your services on our industry-leading site!</li>
//               <li>• Reach local engaged couples and book more weddings.</li>
//               <li>• Trusted by over 77,000 professionals.</li>
//             </ul>
//             {/* <button onClick={() => setShowRegister(true)}
//               className="bg-[#E69B83] hover:shadow-md hover:shadow-[#c16a4d] hover:scale-105 hover:bg-[#c16a4d] font-semibold p-4 rounded-lg transition-all hover:cursor-pointer"
//             >
//               Join as a Partner
//             </button> */}
//             <button
//               onClick={() => navigate("/register")}
//               className="bg-[#E69B83] hover:shadow-md hover:shadow-[#c16a4d] hover:scale-105 hover:bg-[#c16a4d] font-semibold p-4 rounded-lg transition-all hover:cursor-pointer"
//             >
//               Join as a Partner
//             </button>

//           </div>

//           {/* Right Section - Login Form */}
//           <Login />
//         </div>
//       </section>

//       {/* Features Section */}
//       <WhyChooseUs features={features} align="left" col="3" />

//       <Quote
//         text={`"Aapka Talent, Hamara Platform - Together, Let's Make Every Event Unforgettable!"`}
//       />

//       {/* Popup Modal for Register */}
//       {/* {showRegister && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white outline-4 outline-[#E69B83] rounded-xl shadow-xl shadow-[#E69B83] p-0 w-fit max-w-3xl relative">
//             <button
//               onClick={() => setShowRegister(false)}
//               className="absolute top-3 right-3 px-2 py-0.5 rounded-xl text-white bg-[#E69B83] hover:bg-[#c16a4d] hover:scale-105 transition-all ease-linear text-2xl"
//             >
//               ✕
//             </button>

//             <Register />
//           </div>
//          */}
//     </>
//   );
// };

// export default VendorReg;


import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import Quote from "../components/Quote"
import WhyChooseUs from "../components/WhyChooseUs";
import Register from "../components/VendorRegister/Register"
import Login from "../components/Login"
import Footer from "../components/Footer"
// const adminPhone = import.meta.env.VITE_PHONE;
const adminPhone = "9870823328";

const VendorReg = () => {
  const navigate = useNavigate();
  

  const features = [
    {
      icon: (
        <div className="text-global text-lg sm:text-xl lg:text-2xl">
          <div className="relative">
            <span className="text-xl sm:text-2xl lg:text-3xl">1</span>
          </div>
        </div>
      ),
      title: "Guaranteed Business Opportunities",
      description: (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
          <li>Get verified leads every month from high-value clients.</li>
          <li>
            Covers all categories including weddings, birthdays, anniversaries, corporate parties, exhibitions, and more.</li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-lg sm:text-xl lg:text-2xl">
          <div className="relative">
            <span className="text-xl sm:text-2xl lg:text-3xl">2</span>
          </div>
        </div>
      ),
      title: "Hassle-Free Vendor Experience",
      description: (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
          <li>
            OccasionSuper manages client communication, negotiations, and requirements for you.
          </li>
          <li>You just need to deliver your service - we handle the rest.
          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-lg sm:text-xl lg:text-2xl">
          <div className="relative">
            <span className="text-xl sm:text-2xl lg:text-3xl">3</span>
          </div>
        </div>
      ),
      title: "On-Time & Secure Payments",
      description: (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
          <li>Advance payment confirmation before booking.
          </li>
          <li>
            Secured, transparent, and time-bound payments through OccasionSuper.
          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-lg sm:text-xl lg:text-2xl">
          <div className="relative">
            <span className="text-xl sm:text-2xl lg:text-3xl">4</span>
          </div>
        </div>
      ),
      title: "Increased Online Visibility",
      description: (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
          <li>
            Listing your services on OccasionSuper boosts your brand visibility across multiple cities.

          </li>
          <li>We manage your digital presence to enhance your business reach.
          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-lg sm:text-xl lg:text-2xl">
          <div className="relative">
            <span className="text-xl sm:text-2xl lg:text-3xl">5</span>
          </div>
        </div>
      ),
      title: "End-to-End Event Management",
      description: (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
          <li>You only need to deliver your service.
          </li>
          <li>
            OccasionSuper handles planning, coordination, execution, and ensures complete client satisfaction.

          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-lg sm:text-xl lg:text-2xl">
          <div className="relative">
            <span className="text-xl sm:text-2xl lg:text-3xl">6</span>
          </div>
        </div>
      ),
      title: "Zero Marketing Cost",
      description: (
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
          <li>No need to spend on advertising or marketing.
          </li>
          <li>We directly bring interested customers to you.</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
            alt="Background"
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* Left Section - Marketing Content */}
            <div className="text-white w-full order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Grow Your Business with OccasionSuper! 🚀
              </h1>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-[#E69B83] mt-1">•</span>
                  <span>Showcase your services on our fast-growing event marketplace.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E69B83] mt-1">•</span>
                  <span>Connect with thousands of customers looking for event services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E69B83] mt-1">•</span>
                  <span>Get bookings for weddings, birthdays, corporate events, and more.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E69B83] mt-1">•</span>
                  <span>Join our network of trusted vendors and grow together with us!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E69B83] mt-1">•</span>
                  <span>Be an Early Partner & Get Exclusive Benefits 🎉</span>
                </li>
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto bg-[#E69B83] hover:shadow-md hover:shadow-[#c16a4d] hover:scale-105 hover:bg-[#c16a4d] font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-lg transition-all hover:cursor-pointer"
              >
                Join as a Partner
              </button>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full order-1 lg:order-2">
              <Login />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <WhyChooseUs features={features} align="left" col="3" />

      <Quote
        text={`"Aapka Talent, Hamara Platform - Together, Let's Make Every Event Unforgettable!"`}
      />

      <Footer />
      {/* <div className="w-full flex justify-end p-4 bg-gray-50">
        <Link
          to={`https://wa.me/${adminWhatsApp}?text=`} // change to your admin number
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaWhatsapp className="w-5 h-5" />
          WhatsApp Admin
        </Link>
      </div> */}
      {/* <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 mr-2 mt-20">
        <Link
          to={`tel:+${adminPhone}`} // use the phone number from .env
          className="flex items-center gap-2 bg-[#4A3F3B] hover:bg-[#6b5a53] text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaPhone className="w-7 h-7" />
        </Link>
      </div>

      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 mr-2">
        <Link
          to={`https://wa.me/${adminPhone}?text=`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaWhatsapp className="w-7 h-7" />

        </Link>
      </div> */}



      <div className="fixed right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-end gap-2 sm:gap-3 lg:gap-4">
        {/* Phone Button */}
        <Link
          to={`tel:+${adminPhone}`}
          className="flex items-center bg-[#4A3F3B] hover:bg-[#6b5a53] text-white p-2 sm:p-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
          title="Call Admin"
        >
          <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden lg:inline ml-2 text-xs sm:text-sm">Call</span>
        </Link>
        {/* WhatsApp Button */}
        <Link
          to={`https://wa.me/${adminPhone}?text=`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-green-500 hover:bg-green-600 text-white p-2 sm:p-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
          title="WhatsApp Admin"
        >
          <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden lg:inline ml-2 text-xs sm:text-sm">WhatsApp</span>
        </Link>
      </div>



      {/* Popup Modal for Register */}
      {/* {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white outline-4 outline-[#E69B83] rounded-xl shadow-xl shadow-[#E69B83] p-0 w-fit max-w-3xl relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-3 right-3 px-2 py-0.5 rounded-xl text-white bg-[#E69B83] hover:bg-[#c16a4d] hover:scale-105 transition-all ease-linear text-2xl"
            >
              ✕
            </button>

            <Register />
          </div>
         */}
    </>
  );
};

export default VendorReg;
