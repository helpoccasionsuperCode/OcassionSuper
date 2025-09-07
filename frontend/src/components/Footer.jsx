// import { Link } from "react-router-dom";
// import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

// function Footer() {
//   return (
//     <footer className="text-md bg-[#2B2B2B] text-white py-10 px-6 md:px-20">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="font-bold text-xl">OccasionSuper</h2>
//           </div>
//           <p className="text-gray-300 leading-relaxed mb-4">
//             Aapka event, humara responsibility. <br />
//             Planning se lekar execution tak, sab ek jagah.
//           </p>
//           {/* <div className="flex gap-3">
//             <span className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer">
//               <Phone className="text-white" size={20} />
//             </span>
//             <span className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer">
//               <Mail className="text-white" size={20} />
//             </span>
//           </div> */}


//           <div className="flex gap-3">
//             <Link
//               to="/contact/phone"
//               className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer"
//             >
//               <Phone className="text-white" size={20} />
//             </Link>

//             <Link
//               to="/contact/email"
//               className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer"
//             >
//               <Mail className="text-white" size={20} />
//             </Link>

//             <Link
//               to="/social/facebook"
//               className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer"
//             >
//               <Facebook className="text-white" size={20} />
//             </Link>

//             <Link
//               to="/social/instagram"
//               className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer"
//             >
//               <Instagram className="text-white" size={20} />
//             </Link>

//             <Link
//               to="/social/linkedin"
//               className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer"
//             >
//               <Linkedin className="text-white" size={20} />
//             </Link>
//           </div>
//         </div>

//         {/* Services */}
//         <div>
//           <h3 className="font-bold text-xl mb-4">Services</h3>
//           <ul className="space-y-2 text-gray-300">
//             <li>Weddings</li>
//             <li>Birthday Parties</li>
//             <li>Corporate Events</li>
//             <li>Anniversary</li>
//             <li>Baby Shower</li>
//           </ul>
//         </div>

//         {/* Company */}
//         <div>
//           <h3 className="font-bold text-xl mb-4">Company</h3>
//           <ul className="space-y-2 text-gray-300">
//             <li>About Us</li>
//             <li>Careers</li>
//             <li>Contact</li>
//             <li>Help Center</li>
//             <li>Become a Vendor</li>
//           </ul>
//         </div>

//         {/* Legal */}
//         <div>
//           <h3 className="font-bold text-xl mb-4">Legal</h3>
//           <ul className="space-y-2 text-gray-300">
//             <li>Terms & Conditions</li>
//             <li>Privacy Policy</li>
//             <li>Refund Policy</li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t text-md border-gray-600 mt-8 pt-4 text-center text-gray-400">
//         © 2024 OccasionSuper. All rights reserved. GST-ready invoices available.
//       </div>
//     </footer>
//   );
// }

// export default Footer;

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
const adminPhone = import.meta.env.VITE_PHONE;

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#2B2B2B] text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand & Social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-bold text-lg sm:text-xl">OccasionSuper</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              Aapka event, humara responsibility. <br />
              Planning se lekar execution tak, sab ek jagah.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <Link
                 to={`tel:+91${adminPhone}`}
                className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer hover:bg-[#E69B83] transition-colors duration-200"
              >
                <Phone className="text-white" size={18} />
              </Link>

              <Link
              to="mailto:occasionsuper@gmail.com"
              target="_blank"
                className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer hover:bg-[#E69B83] transition-colors duration-200"
              >
                <Mail className="text-white" size={18} />
              </Link>

              <Link
                to="https://www.facebook.com/Occasionsuper/"
                className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer hover:bg-[#E69B83] transition-colors duration-200"
              >
                <Facebook className="text-white" size={18} />
              </Link>

              <Link
                to="https://www.instagram.com/occasionsupers/"
                className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer hover:bg-[#E69B83] transition-colors duration-200"
              >
                <Instagram className="text-white" size={18} />
              </Link>

              <Link
                to="https://x.com/OccasionSuper"
                className="bg-[#4A3F3B] p-2 rounded-lg cursor-pointer hover:bg-[#E69B83] transition-colors duration-200"
              >
                <Twitter className="text-white" size={18} />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li className="">Weddings</li>
              <li className="">Birthday Parties</li>
              <li className="">Corporate Events</li>
              <li className="">Anniversary</li>
              <li className="">Baby Shower</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li className="">About Us</li>
              <li className="">Careers</li>
              <li className="">Contact</li>
              <li className="">Help Center</li>
              <li
                className="cursor-pointer hover:text-[#E69B83] transition-colors duration-200"
                onClick={() => navigate("/register")}
              >
                Become a Partner
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li className="">Terms & Conditions</li>
              <li className="">Privacy Policy</li>
              <li className="">Refund Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-6 sm:mt-8 pt-4 text-center text-gray-400 text-sm sm:text-base">
          © 2025 OccasionSuper. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
