// import React from 'react'

// const FeatureCard = ({ icon, title, description, align }) => {
//     return (
//         <div className="text-center flex flex-col items-center">
//             {/* Icon */}
//             <div className="flex items-center justify-center">
//                 <div className="w-24 h-24 shadow-md shadow-[#E69B83] border-2 border-[#E69B83] rounded-full flex items-center justify-center">
//                     {icon}
//                 </div>
//             </div>
//             <h3 className="text-2xl font-bold text-global  min-h-[60px] flex items-center justify-center">
//                 {title}
//             </h3>
//             <p
//                 className={`text-gray-500 text-lg leading-relaxed max-w-xs mx-auto ${align === "left" ? "text-left" : "text-center"
//                     }`}
//             >
//                 {description}
//             </p>
//         </div>
//     )
// }

// export default FeatureCard


import React from 'react'

const FeatureCard = ({ icon, title, description, align }) => {
    return (
        <div className="text-center flex flex-col items-center">
            {/* Icon */}
            <div className="flex items-center justify-center">
                <div className="w-24 h-24 shadow-md shadow-[#E69B83] border-2 border-[#E69B83] rounded-full flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-global  min-h-[60px] flex items-center justify-center">
                {title}
            </h3>
            <p
                className={`text-gray-500 text-lg leading-relaxed max-w-xs mx-auto ${align === "left" ? "text-left" : "text-center"
                    }`}
            >
                {description}
            </p>
        </div>
    )
}

export default FeatureCard
