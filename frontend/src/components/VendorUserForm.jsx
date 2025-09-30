import React from "react";
import { useParams } from "react-router-dom";

function VendorUserForm({
    formData = {},
    creating = false,
    userExists = false,
    modeLabel = "Create User",
    handleInputChange = () => {},
    handleGeneratePassword = () => {},
    handleSubmit = (e) => { e && e.preventDefault && e.preventDefault(); },
    onCancel = () => {}
}) {
    const {email} =useParams();
    const { vendorId } = useParams();
    const isForgotMode = /@/.test(email || "");
    const displayedEmail = isForgotMode ? decodeURIComponent(vendorId) : (formData?.email || "");
    const headingText = isForgotMode ? "Forgot password" : "";
    const submitLabel = isForgotMode ? "Update user" : "Create user";
    return (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 bg-white">
            <h3 className="text-lg sm:text-xl text-center font-semibold mb-5">{headingText}</h3>

            {/* Email */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Email Address<span className="text-red-500"> *</span>
                </label>
                <input
                    type="email"
                    name="email"
                    readOnly
                    value={email}
                    onChange={handleInputChange}
                    required
                    className="w-full cursor-not-allowed p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                    placeholder="Enter email address"
                />
            </div>

            {/* Password */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Password<span className="text-red-500"> *</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        name="password"
                        value={formData?.password || ""}
                        onChange={handleInputChange}
                        required
                        className="flex-1 p-3 border border-gray-300 rounded-md text-sm sm:text-base font-mono"
                        placeholder="Click 'Generate Password' to create a strong password"
                    />
                    <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="px-4 py-3 border border-blue-500 rounded-md bg-blue-500 text-white text-sm sm:text-base whitespace-nowrap hover:bg-blue-600"
                    >
                        Generate Password
                    </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    A strong password will be automatically generated with uppercase,
                    lowercase, numbers, and special characters.
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-600 text-sm sm:text-base hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={creating}
                    className={`px-6 py-3 border rounded-md text-white text-sm sm:text-base ${creating
                            ? "bg-gray-500 border-gray-500 cursor-not-allowed"
                            : "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
                        }`}
                >
                    {creating ? (isForgotMode ? "Updating..." : "Creating...") : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default VendorUserForm;
