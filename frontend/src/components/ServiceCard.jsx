// import React from "react";
// import { CheckCircle, ArrowRight } from "lucide-react";

// function ServiceCard({ image, title, subtitle, description }) {
//     return (
//         <div className="bg-white rounded-2xl outline-1 outline-[#E69B83] overflow-hidden hover:outline-2 hover:outline-[#E69B83] hover:shadow-lg hover:shadow-[#E69B83] transition-all duration-300 ease-linear flex flex-col">
//             {/* Image Section */}
//             <div className="relative">
//                 <img src={image} alt={title} className="w-full h-52 object-cover" />
//                 <span className="absolute top-3 right-3 bg-white px-3 py-1 text-sm rounded-full shadow">
//                     Premium
//                 </span>
//             </div>

//             {/* Content Section */}
//             <div className="p-3 flex flex-col gap-3 flex-1">
//                 <div>
//                     <h3 className="text-xl font-bold">{title}</h3>
//                     <p className="text-gray-500 text-sm mb-2">{subtitle}</p>
//                     <p className="text-gray-600 text-sm">{description}</p>
//                 </div>

//                 {/* Quality Assured Section (stays at bottom) */}
//                 <div className="mt-auto flex items-center justify-between w-full p-1 rounded-lg">
//                     <div className="flex items-center gap-2">
//                         <CheckCircle className="w-6 h-6 text-primary" />
//                         <span className="text-lg font-medium leading-none">
//                             Quality Assured
//                         </span>
//                     </div>
//                     <ArrowRight className="w-6 h-6 text-primary" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ServiceCard;


import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

function ServiceCard({ image, title, subtitle, description }) {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl outline-1 outline-[#E69B83] overflow-hidden hover:outline-2 hover:outline-[#E69B83] hover:shadow-lg hover:shadow-[#E69B83] transition-all duration-300 ease-linear flex flex-col h-full">
            {/* Image Section */}
            <div className="relative">
                <img src={image} alt={title} className="w-full h-40 sm:h-48 lg:h-52 object-cover" />
                <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full shadow">
                    Premium
                </span>
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">{subtitle}</p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{description}</p>
                </div>

                {/* Quality Assured Section (stays at bottom) */}
                <div className="mt-auto flex items-center justify-between w-full p-1 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#E69B83]" />
                        <span className="text-sm sm:text-base lg:text-lg font-medium leading-none">
                            Quality Assured
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#E69B83]" />
                </div>
            </div>
        </div>
    );
}

export default ServiceCard;
