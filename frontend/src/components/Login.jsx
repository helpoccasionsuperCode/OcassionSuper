// // vendor login

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import ShowHideButton from "./ShowHideButton";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     navigate("/vendor");
//   };

//   return (
//     <div className="bg-white outline-2 outline-[#E69B83] shadow-xl shadow-[#E69B83] rounded-2xl p-8 md:p-12">
//       <h2 className="text-2xl md:text-3xl font-bold text-global-gradient mb-6 text-center">
//         Business Login
//       </h2>

//       <form className="space-y-5">
//         {/* Email */}
//         <div>
//           <label className="block text-xl text-black font-semibold mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             required
//             className="w-full p-3 outline-1 rounded-lg focus:outline-2 focus:outline-[#E69B83]"
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-xl text-black font-semibold mb-1">
//             Password
//           </label>
//           <div className="relative w-full">
//             <input
//               required
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               className="w-full p-3 outline-1 rounded-lg focus:outline-2 focus:outline-[#E69B83]"
//             />
//             <ShowHideButton
//               show={showPassword}
//               onToggle={() => setShowPassword(!showPassword)}
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           onClick={handleLogin}
//           className="w-full text-2xl bg-[#E69B83] text-white font-semibold p-2 rounded-lg transition-all hover:shadow-md hover:shadow-[#E69B83] hover:bg-[#c16a4d] hover:cursor-pointer"
//         >
//           Login
//         </button>
//       </form>

//       <p className="mt-4 text-center text-gray-600 text-lg hover:text-global-gradient">
//         <Link to="/forgot">Forgot password?</Link>
//       </p>
//     </div>
//   );
// };

// export default Login; 


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import ShowHideButton from "./ShowHideButton";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     navigate("/vendor");
//   };

//   return (
//     <div className="bg-white outline-2 outline-[#E69B83] shadow-xl shadow-[#E69B83] rounded-2xl p-6 sm:p-8 md:p-12 w-full max-w-md mx-auto">
//       <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-global-gradient mb-6 text-center">
//         Business Login
//       </h2>

//       <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
//         {/* Email */}
//         <div>
//           <label className="block text-base sm:text-lg md:text-xl text-black font-semibold mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             required
//             className="w-full p-2 sm:p-3 outline-1 rounded-lg focus:outline-2 focus:outline-[#E69B83] text-sm sm:text-base"
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-base sm:text-lg md:text-xl text-black font-semibold mb-1">
//             Password
//           </label>
//           <div className="relative w-full">
//             <input
//               required
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               className="w-full p-2 sm:p-3 outline-1 rounded-lg focus:outline-2 focus:outline-[#E69B83] text-sm sm:text-base"
//             />
//             <ShowHideButton
//               show={showPassword}
//               onToggle={() => setShowPassword(!showPassword)}
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full text-lg sm:text-xl bg-[#E69B83] text-white font-semibold p-2 sm:p-3 rounded-lg transition-all hover:shadow-md hover:shadow-[#E69B83] hover:bg-[#c16a4d] hover:cursor-pointer"
//         >
//           Login
//         </button>
//       </form>

//       <p className="mt-3 sm:mt-4 text-center text-gray-600 text-sm sm:text-base hover:text-global-gradient">
//         <Link to="/forgot">Forgot password?</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShowHideButton from "./ShowHideButton";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // navigate("/vendor");
  };

  return (
    <div className="bg-white outline-2 outline-[#E69B83] shadow-xl shadow-[#E69B83] rounded-2xl p-6 sm:p-8 md:p-12 w-full max-w-md mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-global-gradient mb-6 text-center">
        Business Login
      </h2>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label className="block text-base sm:text-lg md:text-xl text-black font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full p-2 sm:p-3 outline-1 rounded-lg focus:outline-2 focus:outline-[#E69B83] text-sm sm:text-base"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-base sm:text-lg md:text-xl text-black font-semibold mb-1">
            Password
          </label>
          <div className="relative w-full">
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-2 sm:p-3 outline-1 rounded-lg focus:outline-2 focus:outline-[#E69B83] text-sm sm:text-base"
            />
            <ShowHideButton
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full text-lg sm:text-xl bg-[#E69B83] text-white font-semibold p-2 sm:p-3 rounded-lg transition-all hover:shadow-md hover:shadow-[#E69B83] hover:bg-[#c16a4d] hover:cursor-pointer"
        >
          Login
        </button>
      </form>

      <p className="mt-3 sm:mt-4 text-center text-gray-600 text-sm sm:text-base hover:text-global-gradient">
        <Link to="">Forgot password?</Link>
      </p>
    </div>
  );
};

export default Login;
