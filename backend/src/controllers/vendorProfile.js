const mongoose = require("mongoose");
const User = require("../models/user");
const Vendor = require("../models/vendorRegister");

// GET /vendor/:userId/profile - Fetch current profile data
const getVendorProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Find user and populate vendor data
        const user = await User.findById(userId).populate('vendor_id');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== "vendor") {
            return res.status(403).json({ success: false, message: "Access denied. User is not a vendor" });
        }

        if (!user.is_active) {
            return res.status(403).json({ success: false, message: "User account is inactive" });
        }

        // Prepare response data
        const profileData = {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                phone_number: user.phone_number,
                is_active: user.is_active,
                last_login: user.last_login,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            vendor: null
        };

        // If vendor data exists, include it
        if (user.vendor_id) {
            const vendor = user.vendor_id;
            profileData.vendor = {
                id: vendor._id,
                userId: vendor.userId,
                businessName: vendor.businessName,
                ownerName: vendor.ownerName,
                email: vendor.email,
                phone: vendor.phone,
                city: vendor.city,
                serviceArea: vendor.serviceArea,
                socialMedia: vendor.socialMedia,
                categories: vendor.categories,
                othersCategories: vendor.othersCategories,
                images: vendor.images,
                videos: vendor.videos,
                packages: vendor.packages,
                documents: vendor.documents,
                bankDetails: vendor.bankDetails,
                status: vendor.status,
                verificationStatus: vendor.verificationStatus,
                isActive: vendor.isActive,
                createdAt: vendor.createdAt,
                updatedAt: vendor.updatedAt
            };
        }

        return res.status(200).json({
            success: true,
            message: "Profile data fetched successfully",
            data: profileData
        });

    } catch (error) {
        console.error("getVendorProfile error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// PUT /vendor/:userId/profile - Update profile data
const updateVendorProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Find user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== "vendor") {
            return res.status(403).json({ success: false, message: "Access denied. User is not a vendor" });
        }

        if (!user.is_active) {
            return res.status(403).json({ success: false, message: "User account is inactive" });
        }

        // Separate user and vendor update data
        const userUpdateData = {};
        const vendorUpdateData = {};

        // Define allowed fields for user updates
        const allowedUserFields = ['phone_number'];
        allowedUserFields.forEach(field => {
            if (updateData[field] !== undefined) {
                userUpdateData[field] = updateData[field];
            }
        });

        // Define allowed fields for vendor updates
        const allowedVendorFields = [
            'businessName', 'ownerName', 'email', 'phone', 'city', 'serviceArea',
            'socialMedia', 'categories', 'othersCategories', 'images', 'videos',
            'packages', 'documents', 'bankDetails'
        ];

        allowedVendorFields.forEach(field => {
            if (updateData[field] !== undefined) {
                vendorUpdateData[field] = updateData[field];
            }
        });

        // Validate email format if being updated
        if (vendorUpdateData.email) {
            const emailRegex = /@gmail\.com$/;
            if (!emailRegex.test(vendorUpdateData.email)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Email must contain @gmail.com" 
                });
            }
            vendorUpdateData.email = vendorUpdateData.email.toLowerCase().trim();
        }

        // Validate phone format if being updated
        if (vendorUpdateData.phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(vendorUpdateData.phone)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid mobile number. Please enter exactly 10 digits." 
                });
            }
            vendorUpdateData.phone = vendorUpdateData.phone.replace(/\s+/g, '');
        }

        // Validate categories if being updated
        if (vendorUpdateData.categories && !Array.isArray(vendorUpdateData.categories)) {
            return res.status(400).json({ 
                success: false, 
                message: "Categories must be an array" 
            });
        }

        // Validate packages if being updated
        if (vendorUpdateData.packages && !Array.isArray(vendorUpdateData.packages)) {
            return res.status(400).json({ 
                success: false, 
                message: "Packages must be an array" 
            });
        }

        // Update user data if there are user fields to update
        let updatedUser = user;
        if (Object.keys(userUpdateData).length > 0) {
            updatedUser = await User.findByIdAndUpdate(
                userId, 
                userUpdateData, 
                { new: true, runValidators: true }
            );
        }

        // Update vendor data if there are vendor fields to update
        let updatedVendor = null;
        if (user.vendor_id && Object.keys(vendorUpdateData).length > 0) {
            updatedVendor = await Vendor.findByIdAndUpdate(
                user.vendor_id,
                vendorUpdateData,
                { new: true, runValidators: true }
            );
        }

        // If no vendor exists but vendor data is being updated, create vendor record
        if (!user.vendor_id && Object.keys(vendorUpdateData).length > 0) {
            const newVendor = new Vendor({
                ...vendorUpdateData,
                status: 'pending' // New vendor starts as pending
            });
            updatedVendor = await newVendor.save();

            // Link vendor to user
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { vendor_id: updatedVendor._id },
                { new: true }
            );
        }

        // Prepare response data
        const responseData = {
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                role: updatedUser.role,
                phone_number: updatedUser.phone_number,
                is_active: updatedUser.is_active,
                vendor_id: updatedUser.vendor_id,
                last_login: updatedUser.last_login,
                updatedAt: updatedUser.updatedAt
            }
        };

        if (updatedVendor) {
            responseData.vendor = {
                id: updatedVendor._id,
                userId: updatedVendor.userId,
                businessName: updatedVendor.businessName,
                ownerName: updatedVendor.ownerName,
                email: updatedVendor.email,
                phone: updatedVendor.phone,
                city: updatedVendor.city,
                serviceArea: updatedVendor.serviceArea,
                socialMedia: updatedVendor.socialMedia,
                categories: updatedVendor.categories,
                othersCategories: updatedVendor.othersCategories,
                images: updatedVendor.images,
                videos: updatedVendor.videos,
                packages: updatedVendor.packages,
                documents: updatedVendor.documents,
                bankDetails: updatedVendor.bankDetails,
                status: updatedVendor.status,
                verificationStatus: updatedVendor.verificationStatus,
                isActive: updatedVendor.isActive,
                updatedAt: updatedVendor.updatedAt
            };
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: responseData
        });

    } catch (error) {
        console.error("updateVendorProfile error:", error);
        
        // Handle duplicate key errors
        if (error && error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already exists" 
            });
        }
        
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getVendorProfile,
    updateVendorProfile
};
