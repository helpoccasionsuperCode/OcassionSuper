import React, { useState } from "react";
import { CheckCircle, Shield } from "lucide-react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { Image1 } from "../assets"
import GetStarted from "../components/GetStarted";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Services = () => {
    const [price, setPrice] = useState(0);
    const [selected, setSelected] = useState("All Services");
    const [sortOrder, setSortOrder] = useState("");

    const categories = [
        "All Services",
        "Weddings",
        "Birthday",
        "Corporate",
        "Anniversary",
        "Baby Shower",
        "Theme Parties",
    ];

    const services = [
        {
            id: 1,
            title: "Corporate Grand Buffet (Per Plate)",
            description:
                "Impress your corporate guests with a lavish multi-cuisine buffet. Perfect for office parties, conferences.",
            price: 950,
            rating: 4.8,
            image: Image1, // replace with real img
        },
        {
            id: 2,
            title: "Kids Birthday Bash Decor",
            description:
                "Make your child’s birthday unforgettable with our vibrant balloon and theme decor.",
            price: 18500,
            rating: 4.8,
            image: Image1, // replace with real img
        },
        {
            id: 2,
            title: "Kids Birthday Bash Decor",
            description:
                "Make your child’s birthday unforgettable with our vibrant balloon and theme decor.",
            price: 45500,
            rating: 4.8,
            image: Image1, // replace with real img
        },
        {
            id: 2,
            title: "Kids Birthday Bash Decor",
            description:
                "Make your child’s birthday unforgettable with our vibrant balloon and theme decor.",
            price: 100000,
            rating: 4.8,
            image: Image1, // replace with real img
        },
        {
            id: 2,
            title: "Kids Birthday Bash Decor",
            description:
                "Make your child’s birthday unforgettable with our vibrant balloon and theme decor.",
            price: 5500,
            rating: 4.8,
            image: Image1, // replace with real img
        },
        {
            id: 2,
            title: "Kids Birthday Bash Decor",
            description:
                "Make your child’s birthday unforgettable with our vibrant balloon and theme decor.",
            price: 10500,
            rating: 4.8,
            image: Image1, // replace with real img
        },
    ];


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* ===== 1. Header ===== */}
            <Navbar />
            <div className="text-center mb-10 p-4">
                <div className="inline-block text-md bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-medium mb-2 shadow-sm">
                    👑 Premium Services
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800">
                    OccasionSuper Services
                </h1>
                <p className="text-gray-600 text-lg mt-4">
                    Discover our complete range of premium event services, all managed by{" "}
                    <span className="font-medium">OccasionSuper</span>
                </p>

                {/* Search Bar */}
                <div className="w-3/4 text-center mx-auto mt-8">
                    <SearchBar searchPlaceholder="Search Services" />
                </div>
            </div>

            {/* ===== 2. Layout ===== */}
            <div className="grid grid-cols-4 gap-8 p-4">
                {/* Sidebar */}
                <div className="col-span-1 flex flex-col gap-6">
                    {/* Categories */}
                    <div className="bg-white shadow rounded-2xl p-5">
                        <h2 className="font-bold text-xl mb-3">Categories</h2>
                        <ul className="mx-4 text-lg space-y-3 text-gray-700 font-semibold">
                            {categories.map((category) => (
                                <li
                                    key={category}
                                    className={`cursor-pointer transition ${selected === category
                                        ? "text-global rounded-xl px-2 py-1 bg-[#efe3df]"
                                        : "hover:text-orange-600"
                                        }`}
                                    onClick={() => setSelected(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Range */}
                    <div className="bg-white shadow rounded-2xl p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-lg">Price Range</h2>
                            <span className="text-gray-700 font-medium">
                                ₹{price.toLocaleString()}
                            </span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="500000"
                            step={5000}
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full accent-[#c16a4d]"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>₹0</span>
                            <span>₹500000</span>
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="bg-white shadow rounded-2xl p-5 space-y-6">
                        <div>
                            <h2 className="font-semibold text-lg mb-3">Sort By</h2>
                            <select className="w-full rounded-lg p-2 outline-2 outline-[#E69B83]"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="">Most Popular</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Guarantee */}
                    <div className="bg-white shadow rounded-2xl p-5 space-y-6">
                        <div>
                            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                OccasionSuper Guarantee
                            </h2>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Quality assured services
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Transparent pricing
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    24/7 support
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Money-back guarantee
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-3">
                    <div className="grid grid-cols-2 gap-6">

                        {/* {services
                            .filter((service) => service.price <= price)
                            .sort((a, b) => {
                                if (sortOrder === "lowToHigh") return a.price - b.price;
                                if (sortOrder === "highToLow") return b.price - a.price;
                                return 0;
                            })
                            .map((service) => (
                                <Card key={service.id} {...service} />
                            ))} */}

                            {services
    // .filter((service) => {
    //     // Apply category filter (skip if "All Services")
    //     const matchesCategory =
    //         selected === "All Services" || service.category === selected;

    //     // Apply price filter
    //     const matchesPrice = service.price <= price || price === 0;

    //     return matchesCategory && matchesPrice;
    // })

    .filter((service) => {
    const matchesCategory =
        selected === "All Services" || service.category === selected;
    const matchesPrice = price === 0 || service.price <= price;
    return matchesCategory && matchesPrice;
})

    .sort((a, b) => {
        if (sortOrder === "lowToHigh") return a.price - b.price;
        if (sortOrder === "highToLow") return b.price - a.price;
        return 0;
    })
    .map((service) => (
        <Card key={service.id} {...service} />
    ))}



                    </div>
                </div>
            </div>
            <GetStarted text="Contact Us" />
            <Footer />
        </div>

    );
};

export default Services;
