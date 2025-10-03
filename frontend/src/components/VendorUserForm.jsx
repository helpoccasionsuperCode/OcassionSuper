// import React from "react";
// import { useParams } from "react-router-dom";

// function VendorUserForm({
//     formData = {},
//     creating = false,
//     userExists = false,
//     modeLabel = "Create User",
//     handleInputChange = () => {},
//     handleGeneratePassword = () => {},
//     handleSubmit = (e) => { e && e.preventDefault && e.preventDefault(); },
//     onCancel = () => {}
// }) {
//     const {email} =useParams();
//     const { vendorId } = useParams();
//     const isForgotMode = /@/.test(email || "");
//     const displayedEmail = isForgotMode ? decodeURIComponent(vendorId) : (formData?.email || "");
//     const headingText = isForgotMode ? "Forgot password" : "";
//     const submitLabel = isForgotMode ? "Update user" : "Create user";
//     return (
//         <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 bg-white">
//             <h3 className="text-lg sm:text-xl text-center font-semibold mb-5">{headingText}</h3>

//             {/* Email */}
//             <div className="mb-5">
//                 <label className="block mb-2 font-medium">
//                     Email Address<span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                     type="email"
//                     name="email"
//                     readOnly
//                     value={email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full cursor-not-allowed p-3 border border-gray-300 rounded-md text-sm sm:text-base"
//                     placeholder="Enter email address"
//                 />
//             </div>

//             {/* Password */}
//             <div className="mb-5">
//                 <label className="block mb-2 font-medium">
//                     Password<span className="text-red-500"> *</span>
//                 </label>
//                 <div className="flex flex-col sm:flex-row gap-2">
//                     <input
//                         type="text"
//                         name="password"
//                         value={formData?.password || ""}
//                         onChange={handleInputChange}
//                         required
//                         className="flex-1 p-3 border border-gray-300 rounded-md text-sm sm:text-base font-mono"
//                         placeholder="Click 'Generate Password' to create a strong password"
//                     />
//                     <button
//                         type="button"
//                         onClick={handleGeneratePassword}
//                         className="px-4 py-3 border border-blue-500 rounded-md bg-blue-500 text-white text-sm sm:text-base whitespace-nowrap hover:bg-blue-600"
//                     >
//                         Generate Password
//                     </button>
//                 </div>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                     A strong password will be automatically generated with uppercase,
//                     lowercase, numbers, and special characters.
//                 </p>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
//                 <button
//                     type="button"
//                     onClick={onCancel}
//                     className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-600 text-sm sm:text-base hover:bg-gray-50"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     disabled={creating}
//                     className={`px-6 py-3 border rounded-md text-white text-sm sm:text-base ${creating
//                             ? "bg-gray-500 border-gray-500 cursor-not-allowed"
//                             : "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
//                         }`}
//                 >
//                     {creating ? (isForgotMode ? "Updating..." : "Creating...") : submitLabel}
//                 </button>
//             </div>
//         </form>
//     );
// }

// export default VendorUserForm;


import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateStrongPassword, validatePassword } from "../utils/passwordGenerator";
import { toast } from "react-toastify";
import ShowHideButton from "./ShowHideButton";

function VendorUserForm({
    formData = {},
    creating = false,
    userExists = false,
    modeLabel = "Create User",
    handleInputChange = () => {},
    handleGeneratePassword,
    handleSubmit,
    onCancel = () => {},
    isForgotPasswordPage = false
}) {
    const {email} = useParams();
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const isForgotMode = isForgotPasswordPage;
    const displayedEmail = isForgotMode ? "" : (formData?.email || "");
    const headingText = isForgotMode ? "Forgot password" : "";
    const submitLabel = isForgotMode ? "Update" : "Create user";

    // Local state for forgot password mode
    const [localEmail, setLocalEmail] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Use local password generator if not provided (forgot password mode)
    const handlePasswordGeneration = handleGeneratePassword || (() => {
        const newPassword = generateStrongPassword();
        setLocalPassword(newPassword);
    });

    // Handle forgot password form submission
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();

        if (!localEmail) {
            toast.error("Please enter an email", { position: "top-right" });
            return;
        }

        if (!localPassword) {
            toast.error("Please enter a password", { position: "top-right" });
            return;
        }

        // Validate password
        const { isValid, errors } = validatePassword(localPassword);
        if (!isValid) {
            toast.error(errors[0], { position: "top-right" });
            return;
        }

        try {
            setIsUpdating(true);
            const base = import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com";

            const res = await fetch(`${base}/api/admin/users/reset-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: localEmail,
                    password: localPassword
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                // Check if error is email not found
                if (data.message && data.message.toLowerCase().includes("not found")) {
                    throw new Error("Email not found");
                }
                throw new Error(data.message || `Request failed with ${res.status}`);
            }

            toast.success("Password updated successfully!", { position: "top-right" });

            // Send email with new password
            try {
                toast.info("Sending email to vendor...", { position: "top-right", autoClose: 1500 });
                const emailResponse = await fetch(`${base}/api/vendorEmail/send-mail`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        email: localEmail,
                        password: localPassword,
                        isPasswordReset: true
                    }),
                });
                const emailData = await emailResponse.json();
                if (emailResponse.ok && emailData.success) {
                    toast.success("Email sent successfully to vendor", { position: "top-right" });
                } else {
                    toast.error(`Email sending failed: ${emailData.message || "Unknown error"}`, { position: "top-right" });
                }
            } catch (emailErr) {
                console.error("Email sending error:", emailErr);
                toast.error("Failed to send email to vendor", { position: "top-right" });
            }

            navigate("/vendor-auth");
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Failed to update password", { position: "top-right" });
        } finally {
            setIsUpdating(false);
        }
    };

    const onSubmit = handleSubmit || handleForgotPasswordSubmit;
    const isLoading = isForgotMode ? isUpdating : creating;

    return (
        <form onSubmit={onSubmit} className="border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 bg-white">
            <h3 className="text-lg sm:text-xl text-center font-semibold mb-5">{headingText}</h3>

            {/* Email */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Email Address<span className="text-red-500"> *</span>
                </label>
                <input
                    type="email"
                    name="email"
                    readOnly={!isForgotMode}
                    value={isForgotMode ? localEmail : displayedEmail}
                    onChange={isForgotMode ? (e) => setLocalEmail(e.target.value) : handleInputChange}
                    required
                    className={`w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base ${!isForgotMode ? 'cursor-not-allowed' : ''}`}
                    placeholder="Enter email address"
                />
            </div>

            {/* Password */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Password<span className="text-red-500"> *</span>
                </label>
                {isForgotMode ? (
                    <>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={localPassword}
                                onChange={(e) => setLocalPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                                placeholder="Enter new password"
                            />
                            <ShowHideButton
                                show={showPassword}
                                onToggle={() => setShowPassword((prev) => !prev)}
                            />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.
                        </p>
                    </>
                ) : (
                    <>
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
                                onClick={handlePasswordGeneration}
                                className="px-4 py-3 border border-blue-500 rounded-md bg-blue-500 text-white text-sm sm:text-base whitespace-nowrap hover:bg-blue-600"
                            >
                                Generate Password
                            </button>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            A strong password will be automatically generated with uppercase,
                            lowercase, numbers, and special characters.
                        </p>
                    </>
                )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
                <button
                    type="button"
                    onClick={isForgotMode ? () => navigate("/vendor-auth") : onCancel}
                    className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-600 text-sm sm:text-base hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 border rounded-md text-white text-sm sm:text-base ${isLoading
                            ? "bg-gray-500 border-gray-500 cursor-not-allowed"
                            : "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
                        }`}
                >
                    {isLoading ? (isForgotMode ? "Updating..." : "Creating...") : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default VendorUserForm;
