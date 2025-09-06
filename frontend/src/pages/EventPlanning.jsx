import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import EventBasics from "../components/EventPlanning/EventBasics";
import BudgetPriorities from "../components/EventPlanning/BudgetPriorities";
import VenuePreferences from "../components/EventPlanning/VenuePreferences";
import ServicesRequired from "../components/EventPlanning/ServicesRequired";
import SpecialInstructions from "../components/EventPlanning/SpecialInstructions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

const EventPlanning = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        eventType: "",
        date: "",
        city: "",
        guests: 50,
        budget: 100000,
        priorities: {
            "Food & Catering": 5,
            "Decoration & Ambiance": 5,
            "Photography & Videography": 5,
        },
        venuePreference: "",
    });


    const totalSteps = 5;

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex justify-center items-center p-6 ">
                <div className="w-2/3 p-4 outline-1 outline-[#E69B83] shadow-md shadow-[#E69B83] rounded-2xl">
                    {/* Progress Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold">
                                Event Planner Wizard
                            </h1>
                            <p className="text-md font-semibold text-gray-500">
                                Step {step} of {totalSteps}
                            </p>
                        </div>

                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-[#E69B83] rounded-full"
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Step Content */}
                    {step === 1 && (
                        <EventBasics formData={formData} setFormData={setFormData} />
                    )}
                    {step === 2 && (
                        <BudgetPriorities formData={formData} setFormData={setFormData} />
                    )}
                    {step === 3 && (
                        <VenuePreferences formData={formData} setFormData={setFormData} />
                    )}
                    {step === 4 && (
                        <ServicesRequired formData={formData} setFormData={setFormData} />
                    )}
                    {step === 5 && (
                        <SpecialInstructions
                            event={{
                                type: "Wedding",
                                date: "2025-08-13",
                                city: "Delhi",
                                guests: 210,
                                budget: "100,000",
                                venue: "",
                                services: [],
                            }}
                        />
                    )}

                    {/* Navigation Buttons */}
                    {/* <div className="flex justify-between pt-4">
                        <button
                            onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                            disabled={step === 1}
                            className="px-6 py-2 rounded-lg text-white hover:bg-[#c16a4d] bg-[#E69B83] disabled:opacity-50"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => setStep((prev) => Math.min(prev + 1, totalSteps))}
                            className="px-6 py-2 rounded-lg bg-[#E69B83] hover:bg-[#c16a4d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div> */}

                    <div className="flex justify-between pt-4">
                        {/* Previous Button */}
                        <button
                            onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                            disabled={step === 1}
                            className="px-6 py-2 rounded-lg text-white hover:bg-[#c16a4d] bg-[#E69B83] disabled:opacity-50"
                        >
                            ← Previous
                        </button>

                        {/* Next / Submit Button */}
                        {step === totalSteps ? (
                            <button
                                onClick={() => navigate("/recommendations")}
                                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-700 text-white"
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep((prev) => Math.min(prev + 1, totalSteps))}
                                className="px-6 py-2 rounded-lg bg-[#E69B83] hover:bg-[#c16a4d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventPlanning;
