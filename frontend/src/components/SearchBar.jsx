// // // import React from 'react'
// // // import { Search} from "lucide-react";

// // // function SearchBar() {
// // //     return (
// // //         <div className="mb-8 flex items-center bg-white shadow-md rounded-xl px-4 py-3 gap-3 w-full border border-gray-200">
// // //             <Search className="w-5 h-5 text-gray-400" />
// // //             <input
// // //                 type="text"
// // //                 placeholder="Describe your dream event..."
// // //                 className="flex-1 outline-none text-gray-700"
// // //             />
// // //             <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-[#E69B83] text-white font-medium">
// // //                 AI Search
// // //             </button>
// // //         </div>
// // //     )
// // // }

// // // export default SearchBar


// // import React from 'react'
// // import { Search, MapPin } from "lucide-react";

// // function SearchBar() {
// //     return (
// //         <div className="mb-8 flex items-center bg-white shadow-md rounded-xl px-4 py-3 gap-3 w-full border border-gray-200">
// //             {/* Event search */}
// //             <div className="flex items-center gap-2 flex-1 border-r border-gray-200 pr-3">
// //                 <Search className="w-5 h-5 text-gray-400" />
// //                 <input
// //                     type="text"
// //                     placeholder="Describe your dream event..."
// //                     className="flex-1 outline-none text-gray-700"
// //                 />
// //             </div>

// //             {/* Location search */}
// //             <div className="flex items-center gap-2 flex-1 pl-3">
// //                 <MapPin className="w-5 h-5 text-gray-400" />
// //                 <input
// //                     type="text"
// //                     placeholder="Search by location..."
// //                     className="flex-1 outline-none text-gray-700"
// //                 />
// //             </div>

// //             {/* Button */}
// //             <button className="ml-3 px-6 py-2 text-lg rounded-lg bg-gradient-to-r from-[#c37a61] via-[#e29177] to-[#367d80] text-white font-medium">
// //                 Search
// //             </button>
// //         </div>
// //     )
// // }

// // export default SearchBar



// // import React from 'react'
// // import { Search} from "lucide-react";

// // function SearchBar() {
// //     return (
// //         <div className="mb-8 flex items-center bg-white shadow-md rounded-xl px-4 py-3 gap-3 w-full border border-gray-200">
// //             <Search className="w-5 h-5 text-gray-400" />
// //             <input
// //                 type="text"
// //                 placeholder="Describe your dream event..."
// //                 className="flex-1 outline-none text-gray-700"
// //             />
// //             <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-[#E69B83] text-white font-medium">
// //                 AI Search
// //             </button>
// //         </div>
// //     )
// // }

// // export default SearchBar


// import React from 'react'
// import { Search, MapPin } from "lucide-react";

// function SearchBar() {
//     return (
//         <div className="mb-8 flex items-center bg-white shadow-md rounded-xl px-4 py-3 gap-3 w-full border border-gray-200">
//             {/* Event search */}
//             <div className="flex items-center gap-2 flex-1 border-r border-gray-200 pr-3">
//                 <Search className="w-5 h-5 text-gray-400" />
//                 <input
//                     type="text"
//                     placeholder="Describe your dream event..."
//                     className="flex-1 outline-none text-gray-700"
//                 />
//             </div>


//             {/* Location search */}
//             <div className="flex items-center gap-2 flex-1 pl-3">
//                 <MapPin className="w-5 h-5 text-gray-400" />
//                 <input
//                     type="text"
//                     placeholder="Search by location..."
//                     className="flex-1 outline-none text-gray-700"
//                 />
//             </div>

//             {/* Button */}
//             <button className="ml-3 px-6 py-2 text-lg rounded-lg bg-gradient-to-r from-[#c37a61] via-[#e29177] to-[#367d80] text-white font-medium">
//                 Search
//             </button>
//         </div>
//     )
// }

// export default SearchBar


import React from "react";
import { Search, MapPin } from "lucide-react";

function SearchBar({ searchPlaceholder, locationPlaceholder }) {
    return (
        <div className="mb-6 sm:mb-8 bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
                <div className="p-3 space-y-3">
                    {/* Search input */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder || "Search..."}
                            className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
                        />
                    </div>

                    {/* Location input (only if locationPlaceholder is passed) */}
                    {locationPlaceholder && (
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={locationPlaceholder}
                                className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
                            />
                        </div>
                    )}

                    {/* Button */}
                    <button className="w-full px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#c37a61] via-[#e29177] to-[#367d80] text-white font-medium">
                        Search
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center px-4 py-3 gap-3">
                {/* Search input */}
                <div
                    className={`flex items-center gap-2 flex-1 ${locationPlaceholder ? "border-r border-gray-200 pr-3" : ""
                        }`}
                >
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder || "Search..."}
                        className="flex-1 outline-none text-gray-700"
                    />
                </div>

                {/* Location input (only if locationPlaceholder is passed) */}
                {locationPlaceholder && (
                    <div className="flex items-center gap-2 flex-1 pl-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={locationPlaceholder}
                            className="flex-1 outline-none text-gray-700"
                        />
                    </div>
                )}

                {/* Button */}
                <button className="ml-3 px-4 lg:px-6 py-2 text-base lg:text-lg rounded-lg bg-gradient-to-r from-[#c37a61] via-[#e29177] to-[#367d80] text-white font-medium">
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
