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
        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <span className="inline-flex items-center gap-2 bg-[#ecebeb] text-[#E69B83] px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                        ❤️ Customer Stories
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-4 sm:mt-6">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-500 text-base sm:text-lg lg:text-xl mt-2 sm:mt-3 max-w-3xl mx-auto px-4">
                        Real experiences from real customers who trusted OccasionSuper
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
            </div>
        </section>

    );
};

export default CustomerStories;
