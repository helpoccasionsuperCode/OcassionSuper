// import React from "react";
// import { CheckCircle, Calendar, DollarSign, Star, MessageCircle, Crown } from "lucide-react";

// function VendorIntro() {
//     return (
//         <div className="bg-[#f9fafb] h-fit p-4">
//             {/* Top Section */}
//             <div className="flex justify-between items-start p-4">
//                 <div>
//                     {/* <span className="p-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
//                         <Crown className="w-5 h-5" />Verified Vendor
//                     </span> */}
//                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-lg font-medium">
//                         <Crown className="w-4 h-4" />
//                         Verified Vendor
//                     </span>

//                     <h1 className="text-3xl font-bold text-gray-800 mt-2">
//                         Welcome back, User!
//                     </h1>
//                     <p className="text-gray-600 mt-1">Shaadi Planners India • Delhi</p>
//                 </div>

//                 <div className="flex flex-col items-end mt-4">
//                     <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 text-green-600 font-medium">
//                         <CheckCircle className="w-4 h-4" />
//                         Approved
//                     </span>
//                     <p className="text-gray-500 text-sm mt-2">
//                         Member since 8/26/2025
//                     </p>
//                 </div>
//             </div>

//             {/* Stats Section */}
//             <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
//                 <div className="bg-[#fff5f2] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
//                     <div className="flex justify-center basis-2/5">
//                         <MessageCircle className="w-10 h-10 text-orange-400" />
//                     </div>
//                     <div className="basis-3/5 px-3">
//                         <p className="text-gray-500 text-md">New Leads</p>
//                         <h2 className="text-2xl font-bold text-gray-800">1</h2>
//                     </div>
//                 </div>
//                 {/* Upcoming Jobs */}
//                 <div className="bg-[#f0f6f8] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
//                     {/* Icon - 40% */}
//                     <div className="flex justify-center basis-2/5">
//                         <Calendar className="w-10 h-10 text-teal-500" />
//                     </div>

//                     {/* Content - 60% */}
//                     <div className="basis-3/5">
//                         <p className="text-gray-500 text-sm">Upcoming Jobs</p>
//                         <h2 className="text-2xl font-bold text-gray-800">0</h2>
//                     </div>
//                 </div>

//                 {/* Total Earnings */}
//                 <div className="bg-[#fff5f2] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
//                     <div className="flex justify-center basis-2/5">
//                         <DollarSign className="w-10 h-10 text-orange-500" />
//                     </div>
//                     <div className="basis-3/5">
//                         <p className="text-gray-500 text-sm">Total Earnings</p>
//                         <h2 className="text-2xl font-bold text-gray-800">₹535,000</h2>
//                     </div>
//                 </div>

//                 {/* Avg Rating */}
//                 <div className="bg-[#f0f6f8] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
//                     <div className="flex justify-center basis-2/5">
//                         <Star className="w-10 h-10 text-teal-500" />
//                     </div>
//                     <div className="basis-3/5">
//                         <p className="text-gray-500 text-sm">Avg Rating</p>
//                         <h2 className="text-2xl font-bold text-gray-800">4.4</h2>
//                     </div>
//                 </div>

//                 {/* Completed */}
//                 <div className="bg-[#fff5f2] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
//                     <div className="flex justify-center basis-2/5">
//                         <CheckCircle className="w-10 h-10 text-orange-400" />
//                     </div>
//                     <div className="basis-3/5">
//                         <p className="text-gray-500 text-sm">Completed</p>
//                         <h2 className="text-2xl font-bold text-gray-800">0</h2>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }

// export default VendorIntro;



import React from "react";
import { CheckCircle, Calendar, DollarSign, Star, MessageCircle, Crown } from "lucide-react";

function VendorIntro() {
    return (
        <div className="bg-[#f9fafb] h-fit p-4">
            {/* Top Section */}
            <div className="flex justify-between items-start p-4">
                <div>
                    {/* <span className="p-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                        <Crown className="w-5 h-5" />Verified Vendor
                    </span> */}
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-lg font-medium">
                        <Crown className="w-4 h-4" />
                        Verified Vendor
                    </span>

                    <h1 className="text-3xl font-bold text-gray-800 mt-2">
                        Welcome back, User!
                    </h1>
                    <p className="text-gray-600 mt-1">Shaadi Planners India • Delhi</p>
                </div>

                <div className="flex flex-col items-end mt-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Approved
                    </span>
                    <p className="text-gray-500 text-sm mt-2">
                        Member since 8/26/2025
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="bg-[#fff5f2] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
                    <div className="flex justify-center basis-2/5">
                        <MessageCircle className="w-10 h-10 text-orange-400" />
                    </div>
                    <div className="basis-3/5 px-3">
                        <p className="text-gray-500 text-md">New Leads</p>
                        <h2 className="text-2xl font-bold text-gray-800">1</h2>
                    </div>
                </div>
                {/* Upcoming Jobs */}
                <div className="bg-[#f0f6f8] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
                    {/* Icon - 40% */}
                    <div className="flex justify-center basis-2/5">
                        <Calendar className="w-10 h-10 text-teal-500" />
                    </div>

                    {/* Content - 60% */}
                    <div className="basis-3/5">
                        <p className="text-gray-500 text-sm">Upcoming Jobs</p>
                        <h2 className="text-2xl font-bold text-gray-800">0</h2>
                    </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-[#fff5f2] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
                    <div className="flex justify-center basis-2/5">
                        <DollarSign className="w-10 h-10 text-orange-500" />
                    </div>
                    <div className="basis-3/5">
                        <p className="text-gray-500 text-sm">Total Earnings</p>
                        <h2 className="text-2xl font-bold text-gray-800">₹535,000</h2>
                    </div>
                </div>

                {/* Avg Rating */}
                <div className="bg-[#f0f6f8] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
                    <div className="flex justify-center basis-2/5">
                        <Star className="w-10 h-10 text-teal-500" />
                    </div>
                    <div className="basis-3/5">
                        <p className="text-gray-500 text-sm">Avg Rating</p>
                        <h2 className="text-2xl font-bold text-gray-800">4.4</h2>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-[#fff5f2] outline-1 rounded-2xl p-4 shadow-sm flex items-center">
                    <div className="flex justify-center basis-2/5">
                        <CheckCircle className="w-10 h-10 text-orange-400" />
                    </div>
                    <div className="basis-3/5">
                        <p className="text-gray-500 text-sm">Completed</p>
                        <h2 className="text-2xl font-bold text-gray-800">0</h2>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default VendorIntro;
