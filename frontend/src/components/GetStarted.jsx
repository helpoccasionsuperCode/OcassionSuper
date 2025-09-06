// import { Sparkles } from "lucide-react";

// function GetStarted() {
//   return (
//     <section className="bg-gradient-to-r from-[#c37a61] via-[#e29177] to-[#367d80] text-center py-20 px-6">
//       {/* Top button */}
//       <div className="flex justify-center mb-6">
//         <button className="flex font-medium text-lg items-center gap-2 bg-white/20 text-white px-6 py-2 rounded-full shadow-md">
//           <Sparkles size={18} />
//           Start Your Journey
//         </button>
//       </div>

//       {/* Main Heading */}
//       <h1 className="text-5xl font-extrabold text-white mb-3">
//         Ready to Create Magic?
//       </h1>

//       {/* Subtext */}
//       <p className="text-xl  text-white/90 mb-10 max-w-2xl mx-auto">
//         Join thousands of satisfied customers who trusted{" "}
//         <span className="font-semibold">OccasionSuper</span> to make their
//         dreams come true
//       </p>

//       {/* Buttons */}
//       <div className="flex justify-center gap-4 flex-wrap">
//         <button className="flex text-xl font-medium items-center gap-2 bg-[#2F7A78] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#1a3e3e] hover:outline-none hover:scale-105 transition-all ease-linear">
//           <Sparkles size={18} />
//           Start Planning Now
//         </button>
//         <button className="px-14 py-3 text-xl font-medium rounded-xl border border-white text-white hover:bg-white hover:scale-105 hover:text-[#E69B83] transition-all ease-linear">
//           Explore Services
//         </button>
//       </div>
//     </section>
//   );
// }

// export default GetStarted;


import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GetStarted({text}) {
  
 const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-[#c37a61] via-[#e29177] to-[#367d80] text-center py-20 px-6">
      {/* Top button */}
      <div className="flex justify-center mb-6">
        <button className="flex font-medium text-lg items-center gap-2 bg-white/20 text-white px-6 py-2 rounded-full shadow-md">
          <Sparkles size={18} />
          Start Your Journey
        </button>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl font-extrabold text-white mb-3">
        Ready to Create Magic?
      </h1>

      {/* Subtext */}
      <p className="text-xl  text-white/90 mb-10 max-w-2xl mx-auto">
        Join thousands of satisfied customers who trusted{" "}
        <span className="font-semibold">OccasionSuper</span> to make their
        dreams come true
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="flex text-xl cursor-pointer font-medium items-center gap-2 bg-[#2F7A78] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#1a3e3e] hover:outline-none hover:scale-105 transition-all ease-linear"
         onClick={() => navigate("/event-planning")} >
          <Sparkles size={18} />
          Start Planning Now
        </button>
        <button className="px-14 py-3 cursor-pointer text-xl font-medium rounded-xl border border-white text-white hover:bg-white hover:scale-105 hover:text-[#E69B83] transition-all ease-linear">
          {text}
        </button>
      </div>
    </section>
  );
}

export default GetStarted;
