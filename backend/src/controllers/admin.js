const mongoose = require("mongoose");
const User = require("../models/user");
const Vendor = require("../models/vendorRegister");

const createVendorUser = async (req, res) => {
    try {
        let { email, password, phone_number, vendor_id } = req.body;

        // Normalize inputs
        email = typeof email === "string" ? email.trim().toLowerCase() : email;
        password = typeof password === "string" ? password.trim() : password;
        phone_number = typeof phone_number === "string" ? phone_number.trim() : phone_number;

        if (!email || !password || !vendor_id) {
            return res.status(400).json({ success: false, message: "email, password and vendor_id are required" });
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }

        const user = new User({
            role: "vendor",
            email,
            password,
            phone_number: phone_number || null,
            vendor_id: vendor._id,
            is_active: true,
        });
        await user.save();

        return res.status(201).json({ success: true, message: "Vendor user created successfully", data: { id: user._id, email: user.email, role: user.role, vendor_id: user.vendor_id } });
    } catch (error) {
        // Duplicate key safety net
        if (error && error.code === 11000) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }
        console.error("createVendorUser error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
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

module.exports = {
    createVendorUser,
    approveVendor,
    setUserActiveState,
    // Fetch a single vendor with media links
    getVendorById: async (req, res) => {
        try {
            const { vendor_id } = req.params;
            if (!mongoose.isValidObjectId(vendor_id)) {
                return res.status(400).json({ success: false, message: "Invalid vendor_id" });
            }
            const vendor = await Vendor.findById(vendor_id);
            if (!vendor) {
                return res.status(404).json({ success: false, message: "Vendor not found" });
            }
            // Normalize nulls to arrays/objects so frontend can iterate safely
            const safe = (arr) => Array.isArray(arr) ? arr : [];
            const documents = vendor.documents || {};
            const payload = {
                _id: vendor._id,
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
            const { vendor_id } = req.params;
            const { status } = req.body;

            const allowed = ["pending", "approved", "rejected", "suspended"];
            if (!mongoose.isValidObjectId(vendor_id)) {
                return res.status(400).json({ success: false, message: "Invalid vendor_id" });
            }
            if (!allowed.includes(status)) {
                return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowed.join(", ")}` });
            }

            const vendor = await Vendor.findByIdAndUpdate(
                vendor_id,
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
    }
};


