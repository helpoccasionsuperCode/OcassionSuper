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


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Quote from "../components/Quote"
import WhyChooseUs from "../components/WhyChooseUs";
import Register from "../components/VendorRegister/Register"
import Login from "../components/Login"
import Footer from "../components/Footer"

const VendorReg = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <div className="text-global text-2xl">
          <div className="relative">
            <span className="text-3xl">1</span>
          </div>
        </div>
      ),
      title: "Guaranteed Business Opportunities",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Har mahine verified leads aur high-value clients</li>
          <li>
            Weddings, birthdays, anniversaries, corporate parties, exhibitions
            aur sab categories covers
          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-2xl">
          <div className="relative">
            <span className="text-3xl">2</span>
          </div>
        </div>
      ),
      title: "Hassle-Free Vendor Experience",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Client communication, negotiations aur requirements OccasionSuper
            handle karega
          </li>
          <li>Aapko sirf service deliver karni hai - baaki kaam hum sambhalte hain</li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-2xl">
          <div className="relative">
            <span className="text-3xl">3</span>
          </div>
        </div>
      ),
      title: "On-Time & Secure Payments",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Advance payment confirmation</li>
          <li>
            OccasionSuper ke through secured, transparent aur time-bound payments
          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-2xl">
          <div className="relative">
            <span className="text-3xl">4</span>
          </div>
        </div>
      ),
      title: "Increased Online Visibility",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>
            OccasionSuper par listing se aapki brand visibility multiple cities
            me badhegi
          </li>
          <li>Aapke business ka digital presence hum manage karte hain</li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-2xl">
          <div className="relative">
            <span className="text-3xl">5</span>
          </div>
        </div>
      ),
      title: "End-to-End Event Management",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Aapko sirf apna kaam deliver karna hota hai</li>
          <li>
            Planning, coordination, execution aur client satisfaction ka zimma
            OccasionSuper ka
          </li>
        </ul>
      ),
    },
    {
      icon: (
        <div className="text-global text-2xl">
          <div className="relative">
            <span className="text-3xl">6</span>
          </div>
        </div>
      ),
      title: "Zero Marketing Cost",
      description: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Aapko advertising ya marketing me paisa kharch nahi karna</li>
          <li>Hum aapko directly interested customers tak le aate hain</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 w-[90%] max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Section - Marketing Content */}
          <div className="text-white md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow your business with us!
            </h1>
            <ul className="space-y-3 mb-6 text-lg">
              <li>• Showcase your services on our industry-leading site!</li>
              <li>• Reach local engaged couples and book more weddings.</li>
              <li>• Trusted by over 77,000 professionals.</li>
            </ul>
            {/* <button onClick={() => setShowRegister(true)}
              className="bg-[#E69B83] hover:shadow-md hover:shadow-[#c16a4d] hover:scale-105 hover:bg-[#c16a4d] font-semibold p-4 rounded-lg transition-all hover:cursor-pointer"
            >
              Join as a Partner
            </button> */}
            <button
              onClick={() => navigate("/register")}
              className="bg-[#E69B83] hover:shadow-md hover:shadow-[#c16a4d] hover:scale-105 hover:bg-[#c16a4d] font-semibold p-4 rounded-lg transition-all hover:cursor-pointer"
            >
              Join as a Partner
            </button>

          </div>

          {/* Right Section - Login Form */}
          <Login />
        </div>
      </section>

      {/* Features Section */}
      <WhyChooseUs features={features} align="left" col="3" />

      <Quote
        text={`"Aapka Talent, Hamara Platform - Together, Let's Make Every Event Unforgettable!"`}
      />

      <Footer/>

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
