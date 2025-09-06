// import React from "react";
// import ReviewCard from "./ReviewCard";

// const reviews = [
//     {
//         stars: 5,
//         text: `OccasionSuper ne meri shaadi ki planning itni easy bana di! Sab kuch perfect tha, vendors bhi top-notch. Highly recommended!`,
//         name: "Priya Sharma",
//         role: "Wedding Planning",
//         image: "https://randomuser.me/api/portraits/women/65.jpg",
//     },
//     {
//         stars: 4,
//         text: `Corporate event ke liye catering aur decor book kiya tha. Service bahut acchi thi aur team ne sab manage kar liya smoothly. Great experience!`,
//         name: "Rahul Kapoor",
//         role: "Corporate Event",
//         image: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     {
//         stars: 5,
//         text: `Mere bete ki birthday party ke liye DJ aur photographer OccasionSuper se mile. Both were amazing! Kids had a blast. Thank you!`,
//         name: "Anjali Singh",
//         role: "Birthday Party",
//         image: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
// ];

// const CustomerStories = () => {
//     return (
//         <section className="py-16 px-4 md:px-16 bg-white">
//             <div className="text-center mb-12">
//                 <span className="inline-flex items-center gap-2 bg-[#ecebeb] text-[#E69B83] px-4 py-2 rounded-full text-lg font-medium">
//                     ❤️ Customer Stories
//                 </span>
//                 <h2 className="text-3xl md:text-4xl font-bold mt-4">
//                     What Our Customers Say
//                 </h2>
//                 <p className="text-gray-500 text-xl mt-1">
//                     Real experiences from real customers who trusted OccasionSuper
//                 </p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//                 {reviews.map((review, index) => (
//                     <ReviewCard key={index} review={review} />
//                 ))}
//             </div>
//         </section>

//     );
// };

// export default CustomerStories;


import React from "react";
import ReviewCard from "./ReviewCard";

const reviews = [
    {
        stars: 5,
        text: `OccasionSuper ne meri shaadi ki planning itni easy bana di! Sab kuch perfect tha, vendors bhi top-notch. Highly recommended!`,
        name: "Priya Sharma",
        role: "Wedding Planning",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        stars: 4,
        text: `Corporate event ke liye catering aur decor book kiya tha. Service bahut acchi thi aur team ne sab manage kar liya smoothly. Great experience!`,
        name: "Rahul Kapoor",
        role: "Corporate Event",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        stars: 5,
        text: `Mere bete ki birthday party ke liye DJ aur photographer OccasionSuper se mile. Both were amazing! Kids had a blast. Thank you!`,
        name: "Anjali Singh",
        role: "Birthday Party",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
];

const CustomerStories = () => {
    return (
        <section className="py-16 px-4 md:px-16 bg-white">
            <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 bg-[#ecebeb] text-[#E69B83] px-4 py-2 rounded-full text-lg font-medium">
                    ❤️ Customer Stories
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4">
                    What Our Customers Say
                </h2>
                <p className="text-gray-500 text-xl mt-1">
                    Real experiences from real customers who trusted OccasionSuper
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))}
            </div>
        </section>

    );
};

export default CustomerStories;
