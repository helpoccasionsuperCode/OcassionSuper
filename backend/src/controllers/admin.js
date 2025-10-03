// const mongoose = require("mongoose");
// const User = require("../models/user");
// const Vendor = require("../models/vendorRegister");

// const createVendorUser = async (req, res) => {
//     try {
//         const {
//             email,
//             password,
//             phone_number, 
//             vendor_id,
//             businessName,
//             ownerName,
//             city,
//             serviceArea,
//             categories,
//             othersCategories
//         } = req.body;

//         console.log("Raw request body:", req.body);
//         console.log("Extracted fields:", {
//             email,
//             password: password ? "***" : "missing",
//             phone_number,
//             vendor_id,
//             businessName,
//             ownerName,
//             city,
//             serviceArea,
//             categories,
//             othersCategories
//         });

//         // Normalize inputs
//         const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : email;
//         const normalizedPassword = typeof password === "string" ? password.trim() : password;
//         const normalizedPhoneNumber = typeof phone_number === "string" ? phone_number.trim() : phone_number;
//         const normalizedBusinessName = typeof businessName === "string" ? businessName.trim() : businessName;
//         const normalizedOwnerName = typeof ownerName === "string" ? ownerName.trim() : ownerName;
//         const normalizedCity = typeof city === "string" ? city.trim() : city;
//         const normalizedServiceArea = typeof serviceArea === "string" ? serviceArea.trim() : serviceArea;

//         // Validate required fields
//         if (!normalizedEmail || !normalizedPassword || !vendor_id) {
//             return res.status(400).json({ success: false, message: "email, password and vendor_id are required" });
//         }

//         if (!normalizedBusinessName || !normalizedOwnerName || !normalizedCity || !normalizedServiceArea) {
//             return res.status(400).json({ success: false, message: "businessName, ownerName, city, and serviceArea are required" });
//         }

//         if (!mongoose.isValidObjectId(vendor_id)) {
//             return res.status(400).json({ success: false, message: "Invalid vendor_id" });
//         }

//         const vendor = await Vendor.findById(vendor_id);
//         if (!vendor) {
//             return res.status(404).json({ success: false, message: "Vendor not found" });
//         }
//         if (vendor.status !== "approved") {
//             return res.status(400).json({ success: false, message: "Vendor is not approved" });
//         }

//         // Enforce unique email across users
//         const existingUser = await User.findOne({ email: normalizedEmail });
//         if (existingUser) {
//             return res.status(409).json({ success: false, message: "User with this email already exists" });
//         }

//         // Process categories arrays
//         let processedCategories = [];
//         if (Array.isArray(categories)) {
//             processedCategories = categories.filter(c => c && c.trim());
//         } else if (typeof categories === 'string' && categories.trim()) {
//             processedCategories = categories.split(',').map(c => c.trim()).filter(c => c);
//         }

//         let processedOthersCategories = [];
//         if (Array.isArray(othersCategories)) {
//             processedOthersCategories = othersCategories.filter(c => c && c.trim());
//         } else if (typeof othersCategories === 'string' && othersCategories.trim()) {
//             processedOthersCategories = othersCategories.split(',').map(c => c.trim()).filter(c => c);
//         }

//         const userData = {
//             role: "vendor",
//             email: normalizedEmail,
//             password: normalizedPassword,
//             phone_number: normalizedPhoneNumber || null,
//             vendor_id: vendor._id,
//             businessName: normalizedBusinessName,
//             ownerName: normalizedOwnerName,
//             city: normalizedCity,
//             serviceArea: normalizedServiceArea,
//             categories: processedCategories,
//             othersCategories: processedOthersCategories,
//             is_active: true,
//         };

//         console.log("Creating user with data:", userData);

//         const user = new User(userData);

//         await user.save();

//         console.log("User saved successfully:", user.toObject());

//         const savedUser = user.toObject();
//         delete savedUser.password; // don't send hashed password back
//         return res.status(201).json({
//             success: true,
//             message: "Vendor user created successfully",
//             data: savedUser
//         });

//     } catch (error) {
//         // Duplicate key safety net
//         if (error && error.code === 11000) {
//             return res.status(409).json({ success: false, message: "User with this email already exists" });
//         }
//         console.error("createVendorUser error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };

// const approveVendor = async (req, res) => {
//     try {
//         const { vendor_id } = req.body;
//         if (!vendor_id || !mongoose.isValidObjectId(vendor_id)) {
//             return res.status(400).json({ success: false, message: "Valid vendor_id is required" });
//         }

//         const vendor = await Vendor.findById(vendor_id);
//         if (!vendor) {
//             return res.status(404).json({ success: false, message: "Vendor not found" });
//         }

//         vendor.status = "approved";
//         await vendor.save();

//         return res.status(200).json({ success: true, message: "Vendor approved", data: { vendor_id: vendor._id } });
//     } catch (error) {
//         console.error("approveVendor error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// const setUserActiveState = async (req, res) => {
//     try {
//         const { user_id } = req.params;
//         const { is_active } = req.body;

//         if (!mongoose.isValidObjectId(user_id)) {
//             return res.status(400).json({ success: false, message: "Invalid user_id" });
//         }
//         if (typeof is_active !== "boolean") {
//             return res.status(400).json({ success: false, message: "is_active must be boolean" });
//         }

//         const user = await User.findByIdAndUpdate(user_id, { is_active }, { new: true });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         return res.status(200).json({ success: true, message: "User state updated", data: { id: user._id, is_active: user.is_active } });
//     } catch (error) {
//         console.error("setUserActiveState error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// // Update existing vendor user (by vendor_id) and sync vendor details
// const updateVendorAndUser = async (req, res) => {
//     try {
//         const { vendor_id } = req.params;
//         if (!mongoose.isValidObjectId(vendor_id)) {
//             return res.status(400).json({ success: false, message: "Invalid vendor_id" });
//         }

//         const {
//             // email is intentionally ignored for updates to avoid unique conflicts
//             password,
//             phone_number,
//             businessName,
//             ownerName,
//             city,
//             serviceArea,
//             categories,
//             othersCategories,
//         } = req.body || {};

//         const vendor = await Vendor.findById(vendor_id);
//         if (!vendor) {
//             return res.status(404).json({ success: false, message: "Vendor not found" });
//         }

//         // Find the existing vendor user
//         const user = await User.findOne({ vendor_id });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "Vendor user not found for this vendor_id" });
//         }

//         // Update user fields if provided
//         if (typeof phone_number !== "undefined") {
//             user.phone_number = typeof phone_number === "string" ? phone_number.trim() : phone_number;
//         }
//         if (typeof businessName !== "undefined") {
//             user.businessName = typeof businessName === "string" ? businessName.trim() : businessName;
//         }
//         if (typeof ownerName !== "undefined") {
//             user.ownerName = typeof ownerName === "string" ? ownerName.trim() : ownerName;
//         }
//         if (typeof city !== "undefined") {
//             user.city = typeof city === "string" ? city.trim() : city;
//         }
//         if (typeof serviceArea !== "undefined") {
//             user.serviceArea = typeof serviceArea === "string" ? serviceArea.trim() : serviceArea;
//         }
//         if (typeof categories !== "undefined") {
//             if (Array.isArray(categories)) {
//                 user.categories = categories.filter(c => c && String(c).trim());
//             } else if (typeof categories === "string" && categories.trim()) {
//                 user.categories = categories.split(',').map(c => c.trim()).filter(Boolean);
//             }
//         }
//         if (typeof othersCategories !== "undefined") {
//             if (Array.isArray(othersCategories)) {
//                 user.othersCategories = othersCategories.filter(c => c && String(c).trim());
//             } else if (typeof othersCategories === "string" && othersCategories.trim()) {
//                 user.othersCategories = othersCategories.split(',').map(c => c.trim()).filter(Boolean);
//             }
//         }
//         if (typeof password === "string" && password.trim()) {
//             user.password = password.trim(); // pre-save hook will hash
//         }

//         await user.save();

//         // Sync vendor document with provided details as well
//         const vendorUpdate = {};
//         if (typeof businessName !== "undefined") vendorUpdate.businessName = businessName;
//         if (typeof ownerName !== "undefined") vendorUpdate.ownerName = ownerName;
//         if (typeof city !== "undefined") vendorUpdate.city = city;
//         if (typeof serviceArea !== "undefined") vendorUpdate.serviceArea = serviceArea;
//         if (typeof categories !== "undefined") {
//             vendorUpdate.categories = Array.isArray(categories)
//                 ? categories.filter(c => c && String(c).trim())
//                 : (typeof categories === "string" && categories.trim() ? categories.split(',').map(c => c.trim()).filter(Boolean) : vendor.categories);
//         }
//         if (typeof othersCategories !== "undefined") {
//             vendorUpdate.othersCategories = Array.isArray(othersCategories)
//                 ? othersCategories.filter(c => c && String(c).trim())
//                 : (typeof othersCategories === "string" && othersCategories.trim() ? othersCategories.split(',').map(c => c.trim()).filter(Boolean) : vendor.othersCategories);
//         }

//         if (Object.keys(vendorUpdate).length > 0) {
//             await Vendor.findByIdAndUpdate(vendor_id, vendorUpdate, { new: true });
//         }

//         const safeUser = user.toObject();
//         delete safeUser.password;
//         return res.status(200).json({ success: true, message: "Vendor user updated successfully", data: { user: safeUser } });
//     } catch (error) {
//         console.error("updateVendorAndUser error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };

// module.exports = {
//     createVendorUser,
//     approveVendor,
//     setUserActiveState,
//     // Fetch a single vendor with complete data
//     getVendorById: async (req, res) => {
//         try {
//             const { id } = req.params;
//             if (!mongoose.isValidObjectId(id)) {
//                 return res.status(400).json({ success: false, message: "Invalid vendor id" });
//             }
//             const vendor = await Vendor.findById(id);
//             if (!vendor) {
//                 return res.status(404).json({ success: false, message: "Vendor not found" });
//             }
//             // Normalize nulls to arrays/objects so frontend can iterate safely
//             const safe = (arr) => Array.isArray(arr) ? arr : [];
//             const documents = vendor.documents || {};

//             // Return complete vendor data
//             const payload = {
//                 ...vendor.toObject(),
//                 images: safe(vendor.images),
//                 videos: safe(vendor.videos),
//                 files: safe(vendor.files),
//                 attachments: safe(vendor.attachments),
//                 documents: {
//                     ...Object.fromEntries(Object.entries(documents).map(([k, v]) => [k, safe(v)]))
//                 }
//             };
//             return res.status(200).json({ success: true, data: payload });
//         } catch (error) {
//             console.error("getVendorById error:", error);
//             return res.status(500).json({ success: false, message: "Internal Server Error" });
//         }
//     },
//     // Added below
//     listVendors: async (req, res) => {
//         try {
//             const { status, city, category } = req.query;

//             const query = {};
//             if (status) query.status = status;
//             if (city) query.city = city;
//             if (category) query.categories = { $in: [category] };

//             const vendors = await Vendor.find(query)
//                 .sort({ createdAt: -1 });

//             // Normalize media fields so frontend can safely render
//             const safe = (arr) => Array.isArray(arr) ? arr : [];
//             const normalized = vendors.map(v => ({
//                 ...v.toObject(),
//                 images: safe(v.images),
//                 videos: safe(v.videos),
//                 documents: Object.fromEntries(
//                     Object.entries(v.documents || {}).map(([k, val]) => [k, safe(val)])
//                 )
//             }));

//             return res.status(200).json({ success: true, data: normalized });
//         } catch (error) {
//             console.error("listVendors error:", error);
//             return res.status(500).json({ success: false, message: "Internal Server Error" });
//         }
//     },
//     updateVendorStatus: async (req, res) => {
//         try {
//             const { id } = req.params;
//             const { status } = req.body;

//             const allowed = ["pending", "approved", "rejected", "suspended"];
//             if (!mongoose.isValidObjectId(id)) {
//                 return res.status(400).json({ success: false, message: "Invalid vendor id" });
//             }
//             if (!allowed.includes(status)) {
//                 return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowed.join(", ")}` });
//             }

//             const vendor = await Vendor.findByIdAndUpdate(
//                 id,
//                 { status },
//                 { new: true }
//             );
//             if (!vendor) {
//                 return res.status(404).json({ success: false, message: "Vendor not found" });
//             }

//             // If vendor is rejected, remove associated vendor users so they no longer appear in users list
//             if (status === "rejected") {
//                 await User.deleteMany({ vendor_id: vendor._id });
//             }

//             return res.status(200).json({ success: true, message: "Vendor status updated", data: { id: vendor._id, status: vendor.status } });
//         } catch (error) {
//             console.error("updateVendorStatus error:", error);
//             return res.status(500).json({ success: false, message: "Internal Server Error" });
//         }
//     },
//     listVendorUsers: async (req, res) => {
//         try {
//             const { active, vendor_id, search } = req.query;
//             const query = { role: "vendor" };
//             if (typeof active !== "undefined") {
//                 if (active === "true" || active === true) query.is_active = true;
//                 if (active === "false" || active === false) query.is_active = false;
//             }
//             if (vendor_id && mongoose.isValidObjectId(vendor_id)) {
//                 query.vendor_id = vendor_id;
//             }
//             if (search) {
//                 query.email = { $regex: search, $options: "i" };
//             }

//             const users = await User.find(query)
//                 .populate({ path: "vendor_id", select: "businessName status city serviceArea" })
//                 .sort({ createdAt: -1 });

//             return res.status(200).json({ success: true, data: users });
//         } catch (error) {
//             console.error("listVendorUsers error:", error);
//             return res.status(500).json({ success: false, message: "Internal Server Error" });
//         }
//     },
//     updateVendorAndUser
// };



const mongoose = require("mongoose");
const User = require("../models/user");
const Vendor = require("../models/vendorRegister");

const createVendorUser = async (req, res) => {
    try {
        const {
            email,
            password,
            phone_number, 
            vendor_id,
            businessName,
            ownerName,
            city,
            serviceArea,
            categories,
            othersCategories
        } = req.body;

        console.log("Raw request body:", req.body);
        console.log("Extracted fields:", {
            email,
            password: password ? "***" : "missing",
            phone_number,
            vendor_id,
            businessName,
            ownerName,
            city,
            serviceArea,
            categories,
            othersCategories
        });

        // Normalize inputs
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : email;
        const normalizedPassword = typeof password === "string" ? password.trim() : password;
        const normalizedPhoneNumber = typeof phone_number === "string" ? phone_number.trim() : phone_number;
        const normalizedBusinessName = typeof businessName === "string" ? businessName.trim() : businessName;
        const normalizedOwnerName = typeof ownerName === "string" ? ownerName.trim() : ownerName;
        const normalizedCity = typeof city === "string" ? city.trim() : city;
        const normalizedServiceArea = typeof serviceArea === "string" ? serviceArea.trim() : serviceArea;

        // Validate required fields
        if (!normalizedEmail || !normalizedPassword || !vendor_id) {
            return res.status(400).json({ success: false, message: "email, password and vendor_id are required" });
        }

        if (!normalizedBusinessName || !normalizedOwnerName || !normalizedCity || !normalizedServiceArea) {
            return res.status(400).json({ success: false, message: "businessName, ownerName, city, and serviceArea are required" });
        }

        if (!mongoose.isValidObjectId(vendor_id)) {
            return res.status(400).json({ success: false, message: "Invalid vendor_id" });
        }

        const vendor = await Vendor.findById(vendor_id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }
        if (vendor.status !== "approved") {
            return res.status(400).json({ success: false, message: "Vendor is not approved" });
        }

        // Enforce unique email across users
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }

        // Process categories arrays
        let processedCategories = [];
        if (Array.isArray(categories)) {
            processedCategories = categories.filter(c => c && c.trim());
        } else if (typeof categories === 'string' && categories.trim()) {
            processedCategories = categories.split(',').map(c => c.trim()).filter(c => c);
        }

        let processedOthersCategories = [];
        if (Array.isArray(othersCategories)) {
            processedOthersCategories = othersCategories.filter(c => c && c.trim());
        } else if (typeof othersCategories === 'string' && othersCategories.trim()) {
            processedOthersCategories = othersCategories.split(',').map(c => c.trim()).filter(c => c);
        }

        const userData = {
            role: "vendor",
            email: normalizedEmail,
            password: normalizedPassword,
            phone_number: normalizedPhoneNumber || null,
            vendor_id: vendor._id,
            businessName: normalizedBusinessName,
            ownerName: normalizedOwnerName,
            city: normalizedCity,
            serviceArea: normalizedServiceArea,
            categories: processedCategories,
            othersCategories: processedOthersCategories,
            is_active: true,
        };

        console.log("Creating user with data:", userData);

        const user = new User(userData);

        await user.save();

        console.log("User saved successfully:", user.toObject());

        const savedUser = user.toObject();
        delete savedUser.password; // don't send hashed password back
        return res.status(201).json({
            success: true,
            message: "Vendor user created successfully",
            data: savedUser
        });

    } catch (error) {
        // Duplicate key safety net
        if (error && error.code === 11000) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }
        console.error("createVendorUser error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const approveVendor = async (req, res) => {
    try {
        const { vendor_id } = req.body;
        if (!vendor_id || !mongoose.isValidObjectId(vendor_id)) {
            return res.status(400).json({ success: false, message: "Valid vendor_id is required" });
        }

        const vendor = await Vendor.findById(vendor_id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        vendor.status = "approved";
        await vendor.save();

        return res.status(200).json({ success: true, message: "Vendor approved", data: { vendor_id: vendor._id } });
    } catch (error) {
        console.error("approveVendor error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const setUserActiveState = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { is_active } = req.body;

        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({ success: false, message: "Invalid user_id" });
        }
        if (typeof is_active !== "boolean") {
            return res.status(400).json({ success: false, message: "is_active must be boolean" });
        }

        const user = await User.findByIdAndUpdate(user_id, { is_active }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User state updated", data: { id: user._id, is_active: user.is_active } });
    } catch (error) {
        console.error("setUserActiveState error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update existing vendor user (by vendor_id) and sync vendor details
const updateVendorAndUser = async (req, res) => {
    try {
        const { vendor_id } = req.params;
        if (!mongoose.isValidObjectId(vendor_id)) {
            return res.status(400).json({ success: false, message: "Invalid vendor_id" });
        }

        const {
            // email is intentionally ignored for updates to avoid unique conflicts
            password,
            phone_number,
            businessName,
            ownerName,
            city,
            serviceArea,
            categories,
            othersCategories,
        } = req.body || {};

        const vendor = await Vendor.findById(vendor_id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        // Find the existing vendor user
        const user = await User.findOne({ vendor_id });
        if (!user) {
            return res.status(404).json({ success: false, message: "Vendor user not found for this vendor_id" });
        }

        // Update user fields if provided
        if (typeof phone_number !== "undefined") {
            user.phone_number = typeof phone_number === "string" ? phone_number.trim() : phone_number;
        }
        if (typeof businessName !== "undefined") {
            user.businessName = typeof businessName === "string" ? businessName.trim() : businessName;
        }
        if (typeof ownerName !== "undefined") {
            user.ownerName = typeof ownerName === "string" ? ownerName.trim() : ownerName;
        }
        if (typeof city !== "undefined") {
            user.city = typeof city === "string" ? city.trim() : city;
        }
        if (typeof serviceArea !== "undefined") {
            user.serviceArea = typeof serviceArea === "string" ? serviceArea.trim() : serviceArea;
        }
        if (typeof categories !== "undefined") {
            if (Array.isArray(categories)) {
                user.categories = categories.filter(c => c && String(c).trim());
            } else if (typeof categories === "string" && categories.trim()) {
                user.categories = categories.split(',').map(c => c.trim()).filter(Boolean);
            }
        }
        if (typeof othersCategories !== "undefined") {
            if (Array.isArray(othersCategories)) {
                user.othersCategories = othersCategories.filter(c => c && String(c).trim());
            } else if (typeof othersCategories === "string" && othersCategories.trim()) {
                user.othersCategories = othersCategories.split(',').map(c => c.trim()).filter(Boolean);
            }
        }
        if (typeof password === "string" && password.trim()) {
            user.password = password.trim(); // pre-save hook will hash
        }

        await user.save();

        // Sync vendor document with provided details as well
        const vendorUpdate = {};
        if (typeof businessName !== "undefined") vendorUpdate.businessName = businessName;
        if (typeof ownerName !== "undefined") vendorUpdate.ownerName = ownerName;
        if (typeof city !== "undefined") vendorUpdate.city = city;
        if (typeof serviceArea !== "undefined") vendorUpdate.serviceArea = serviceArea;
        if (typeof categories !== "undefined") {
            vendorUpdate.categories = Array.isArray(categories)
                ? categories.filter(c => c && String(c).trim())
                : (typeof categories === "string" && categories.trim() ? categories.split(',').map(c => c.trim()).filter(Boolean) : vendor.categories);
        }
        if (typeof othersCategories !== "undefined") {
            vendorUpdate.othersCategories = Array.isArray(othersCategories)
                ? othersCategories.filter(c => c && String(c).trim())
                : (typeof othersCategories === "string" && othersCategories.trim() ? othersCategories.split(',').map(c => c.trim()).filter(Boolean) : vendor.othersCategories);
        }

        if (Object.keys(vendorUpdate).length > 0) {
            await Vendor.findByIdAndUpdate(vendor_id, vendorUpdate, { new: true });
        }

        const safeUser = user.toObject();
        delete safeUser.password;
        return res.status(200).json({ success: true, message: "Vendor user updated successfully", data: { user: safeUser } });
    } catch (error) {
        console.error("updateVendorAndUser error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    createVendorUser,
    approveVendor,
    setUserActiveState,
    // Fetch a single vendor with complete data
    getVendorById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ success: false, message: "Invalid vendor id" });
            }
            const vendor = await Vendor.findById(id);
            if (!vendor) {
                return res.status(404).json({ success: false, message: "Vendor not found" });
            }
            // Normalize nulls to arrays/objects so frontend can iterate safely
            const safe = (arr) => Array.isArray(arr) ? arr : [];
            const documents = vendor.documents || {};

            // Return complete vendor data
            const payload = {
                ...vendor.toObject(),
                images: safe(vendor.images),
                videos: safe(vendor.videos),
                files: safe(vendor.files),
                attachments: safe(vendor.attachments),
                documents: {
                    ...Object.fromEntries(Object.entries(documents).map(([k, v]) => [k, safe(v)]))
                }
            };
            return res.status(200).json({ success: true, data: payload });
        } catch (error) {
            console.error("getVendorById error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    // Added below
    listVendors: async (req, res) => {
        try {
            const { status, city, category } = req.query;

            const query = {};
            if (status) query.status = status;
            if (city) query.city = city;
            if (category) query.categories = { $in: [category] };

            const vendors = await Vendor.find(query)
                .sort({ createdAt: -1 });

            // Normalize media fields so frontend can safely render
            const safe = (arr) => Array.isArray(arr) ? arr : [];
            const normalized = vendors.map(v => ({
                ...v.toObject(),
                images: safe(v.images),
                videos: safe(v.videos),
                documents: Object.fromEntries(
                    Object.entries(v.documents || {}).map(([k, val]) => [k, safe(val)])
                )
            }));

            return res.status(200).json({ success: true, data: normalized });
        } catch (error) {
            console.error("listVendors error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    updateVendorStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const allowed = ["pending", "approved", "rejected", "suspended"];
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ success: false, message: "Invalid vendor id" });
            }
            if (!allowed.includes(status)) {
                return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowed.join(", ")}` });
            }

            const vendor = await Vendor.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            if (!vendor) {
                return res.status(404).json({ success: false, message: "Vendor not found" });
            }

            // If vendor is rejected, remove associated vendor users so they no longer appear in users list
            if (status === "rejected") {
                await User.deleteMany({ vendor_id: vendor._id });
            }

            return res.status(200).json({ success: true, message: "Vendor status updated", data: { id: vendor._id, status: vendor.status } });
        } catch (error) {
            console.error("updateVendorStatus error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    listVendorUsers: async (req, res) => {
        try {
            const { active, vendor_id, search } = req.query;
            const query = { role: "vendor" };
            if (typeof active !== "undefined") {
                if (active === "true" || active === true) query.is_active = true;
                if (active === "false" || active === false) query.is_active = false;
            }
            if (vendor_id && mongoose.isValidObjectId(vendor_id)) {
                query.vendor_id = vendor_id;
            }
            if (search) {
                query.email = { $regex: search, $options: "i" };
            }

            const users = await User.find(query)
                .populate({ path: "vendor_id", select: "businessName status city serviceArea" })
                .sort({ createdAt: -1 });

            return res.status(200).json({ success: true, data: users });
        } catch (error) {
            console.error("listVendorUsers error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    updateVendorAndUser,
    // Reset password by email (for forgot password)
    resetPasswordByEmail: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });
            }

            const normalizedEmail = email.trim().toLowerCase();

            // Find user by email
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) {
                return res.status(404).json({ success: false, message: "Email not found" });
            }

            // Hash the new password
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash(password.trim(), 10);

            // Update password
            user.password = hashedPassword;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password updated successfully",
                data: { email: user.email }
            });
        } catch (error) {
            console.error("resetPasswordByEmail error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
};