const mongoose = require("mongoose");
const User = require("../models/user");
const Vendor = require("../models/vendorRegister");
const VendorRequestModel = require("../models/vendorRequest");
const logger = require("../utils/logger");
const AssignmentHistory = require("../models/assignmentHistory");
const NotificationService = require("../services/notificationService");

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

    // ===== VENDOR REQUEST MANAGEMENT =====

    /**
     * Get all vendor requests for admin dashboard
     * Supports filtering by status, date range, and other criteria
     */
    getAllVendorRequests: async (req, res) => {
        try {
            console.log("Fetching all vendor requests for admin dashboard...");
            
            // Extract query parameters for filtering
            const { 
                status, 
                eventType, 
                city, 
                dateFrom, 
                dateTo, 
                urgency,
                limit = 20, 
                page = 1,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            // Build filter object
            const filter = {};

            // Status filter
            if (status) {
                if (Array.isArray(status)) {
                    filter.status = { $in: status };
                } else {
                    filter.status = status;
                }
            }

            // Event type filter
            if (eventType) {
                filter['eventDetails.eventType'] = eventType;
            }

            // City filter
            if (city) {
                filter['clientInfo.city'] = { $regex: city, $options: 'i' };
            }

            // Date range filter
            if (dateFrom || dateTo) {
                filter['eventDetails.eventDate'] = {};
                if (dateFrom) {
                    filter['eventDetails.eventDate'].$gte = new Date(dateFrom);
                }
                if (dateTo) {
                    filter['eventDetails.eventDate'].$lte = new Date(dateTo);
                }
            }

            // Urgency filter
            if (urgency) {
                filter['preferences.urgency'] = urgency;
            }

            // Calculate pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Build sort object
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            console.log("Admin filter:", filter);
            console.log("Admin sort:", sort);

            // Query vendor requests with vendor details
            const vendorRequests = await VendorRequestModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit));

            // Get total count for pagination
            const totalRequests = await VendorRequestModel.countDocuments(filter);

            // Transform data for admin dashboard
            const adminRequests = vendorRequests.map(request => {
                const requestData = request.toObject();
                
                return {
                    requestId: requestData.requestId,
                    status: requestData.status,
                    statusDisplay: requestData.getStatusDisplay(),
                    
                    // Client Information
                    clientInfo: {
                        name: requestData.clientInfo.name,
                        email: requestData.clientInfo.email,
                        phone: requestData.clientInfo.phone,
                        city: requestData.clientInfo.city
                    },
                    
                    // Event Details
                    eventDetails: {
                        eventType: requestData.eventDetails.eventType,
                        eventDate: requestData.eventDetails.eventDate,
                        guestCount: requestData.eventDetails.guestCount,
                        budget: requestData.eventDetails.budget,
                        location: requestData.eventDetails.location,
                        specialRequirements: requestData.eventDetails.specialRequirements
                    },
                    
                    // Vendor Information
                    vendorInfo: {
                        selectedVendorId: requestData.selectedVendorId,
                        assignedVendorId: requestData.assignedVendorId
                    },
                    
                    // Timeline
                    timeline: {
                        submittedAt: requestData.createdAt,
                        assignedAt: requestData.assignedAt,
                        completedAt: requestData.completedAt,
                        ageInDays: requestData.ageInDays,
                        daysUntilEvent: requestData.daysUntilEvent
                    },
                    
                    // Preferences
                    preferences: requestData.preferences,
                    
                    // Admin Data
                    adminNotes: requestData.adminNotes,
                    isUrgent: requestData.isUrgent(),
                    
                    // Additional Admin Info
                    adminInfo: {
                        isOverdue: requestData.status === 'pending' && requestData.ageInDays > 2,
                        needsAttention: requestData.isUrgent() || (requestData.status === 'pending' && requestData.ageInDays > 1),
                        canAssign: requestData.status === 'pending'
                    }
                };
            });

            logger.info(`Admin vendor requests fetched successfully`, {
                totalRequests: adminRequests.length,
                filters: { status, eventType, city, dateFrom, dateTo, urgency },
                pagination: { page, limit }
            });

            res.status(200).json({
                success: true,
                message: "Vendor requests fetched successfully",
                data: {
                    requests: adminRequests,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(totalRequests / parseInt(limit)),
                        totalRequests: totalRequests,
                        hasNextPage: parseInt(page) < Math.ceil(totalRequests / parseInt(limit)),
                        hasPrevPage: parseInt(page) > 1
                    }
                }
            });

        } catch (error) {
            console.error("getAllVendorRequests error:", error);
            
            logger.error("Failed to fetch vendor requests for admin", {
                error: error.message,
                stack: error.stack,
                query: req.query
            });

            res.status(500).json({
                success: false,
                message: "Failed to fetch vendor requests",
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    },

    /**
     * Assign vendor to client request
     * Admin can override client's vendor choice if needed
     */
    assignVendorToRequest: async (req, res) => {
        try {
            const { requestId } = req.params;
            const { assignedVendorId, adminNotes } = req.body;

            console.log(`Admin assigning vendor ${assignedVendorId} to request ${requestId}`);

            // Validate required fields
            if (!assignedVendorId) {
                return res.status(400).json({
                    success: false,
                    message: "assignedVendorId is required"
                });
            }

            // Find the vendor request
            const vendorRequest = await VendorRequestModel.findOne({
                requestId: parseInt(requestId)
            });

            if (!vendorRequest) {
                return res.status(404).json({
                    success: false,
                    message: "Vendor request not found"
                });
            }

            // Check if request can be assigned
            if (vendorRequest.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: `Cannot assign vendor to request with status: ${vendorRequest.status}`
                });
            }

            // Validate that the assigned vendor exists and is approved
            const assignedVendor = await Vendor.findOne({
                userId: parseInt(assignedVendorId),
                status: "approved",
                isActive: true
            });

            if (!assignedVendor) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned vendor not found or not approved"
                });
            }

            // Check if vendor is already assigned to another pending request for the same event date
            const conflictingRequest = await VendorRequestModel.findOne({
                assignedVendorId: parseInt(assignedVendorId),
                'eventDetails.eventDate': vendorRequest.eventDetails.eventDate,
                status: { $in: ['pending', 'assigned', 'in_progress'] },
                requestId: { $ne: parseInt(requestId) }
            });

            if (conflictingRequest) {
                return res.status(409).json({
                    success: false,
                    message: `Vendor is already assigned to request ${conflictingRequest.requestId} for the same event date`,
                    data: {
                        conflictingRequestId: conflictingRequest.requestId,
                        eventDate: conflictingRequest.eventDetails.eventDate
                    }
                });
            }

            // Update the vendor request
            const updatedRequest = await VendorRequestModel.findOneAndUpdate(
                { requestId: parseInt(requestId) },
                {
                    assignedVendorId: parseInt(assignedVendorId),
                    status: 'assigned',
                    assignedAt: new Date(),
                    adminNotes: adminNotes || vendorRequest.adminNotes,
                    updatedAt: new Date()
                },
                { new: true }
            );

            // Create an entry in the AssignmentHistory for audit trail
            const wasOverride = vendorRequest.selectedVendorId !== parseInt(assignedVendorId);
            const historyEntry = new AssignmentHistory({
                requestId: parseInt(requestId),
                action: 'vendor_assigned',
                actor: {
                    type: 'admin',
                    userId: req.user.id,
                    email: req.user.email,
                    name: req.user.email // Assuming admin name is not in token, email is a good substitute
                },
                assignmentDetails: {
                    previousVendorId: null, // First assignment
                    newVendorId: parseInt(assignedVendorId),
                    previousStatus: vendorRequest.status,
                    newStatus: 'assigned',
                    wasOverride: wasOverride,
                    originalSelectedVendorId: vendorRequest.selectedVendorId
                },
                contextData: {
                    clientInfo: vendorRequest.clientInfo,
                    eventDetails: vendorRequest.eventDetails
                },
                notes: adminNotes || 'Vendor assigned by admin.'
            });
            await historyEntry.save();
            // Log the assignment
            logger.info(`Vendor assigned to request successfully`, {
                requestId: parseInt(requestId),
                assignedVendorId: parseInt(assignedVendorId),
                clientEmail: vendorRequest.clientInfo.email,
                eventType: vendorRequest.eventDetails.eventType,
                eventDate: vendorRequest.eventDetails.eventDate,
                adminId: req.user.id,
                wasOverride: wasOverride
            });

            // Send assignment notifications to both client and vendor
            const notificationData = {
                clientInfo: updatedRequest.clientInfo,
                vendorInfo: {
                    vendorId: assignedVendor.userId,
                    businessName: assignedVendor.businessName,
                    ownerName: assignedVendor.ownerName,
                    email: assignedVendor.email,
                    phone: assignedVendor.phone,
                    city: assignedVendor.city,
                    serviceArea: assignedVendor.serviceArea,
                    categories: assignedVendor.categories
                },
                eventDetails: updatedRequest.eventDetails,
                requestId: updatedRequest.requestId,
                assignedAt: updatedRequest.assignedAt,
                adminNotes: updatedRequest.adminNotes,
                preferences: updatedRequest.preferences
            };            // Send notifications asynchronously (don't wait for completion)
            NotificationService.sendAssignmentNotifications(notificationData);

            // Prepare response data
            const responseData = {
                requestId: updatedRequest.requestId,
                status: updatedRequest.status,
                statusDisplay: updatedRequest.getStatusDisplay(),
                
                // Client Information
                clientInfo: {
                    name: updatedRequest.clientInfo.name,
                    email: updatedRequest.clientInfo.email,
                    phone: updatedRequest.clientInfo.phone,
                    city: updatedRequest.clientInfo.city
                },
                
                // Event Details
                eventDetails: {
                    eventType: updatedRequest.eventDetails.eventType,
                    eventDate: updatedRequest.eventDetails.eventDate,
                    guestCount: updatedRequest.eventDetails.guestCount,
                    budget: updatedRequest.eventDetails.budget,
                    location: updatedRequest.eventDetails.location,
                    specialRequirements: updatedRequest.eventDetails.specialRequirements
                },
                
                // Vendor Information
                vendorInfo: {
                    selectedVendorId: updatedRequest.selectedVendorId,
                    assignedVendorId: updatedRequest.assignedVendorId,
                    wasOverride: wasOverride
                },
                
                // Assigned Vendor Details
                assignedVendorDetails: {
                    vendorId: assignedVendor.userId,
                    businessName: assignedVendor.businessName,
                    ownerName: assignedVendor.ownerName,
                    email: assignedVendor.email,
                    phone: assignedVendor.phone,
                    city: assignedVendor.city,
                    serviceArea: assignedVendor.serviceArea,
                    categories: assignedVendor.categories
                },
                
                // Timeline
                timeline: {
                    submittedAt: updatedRequest.createdAt,
                    assignedAt: updatedRequest.assignedAt,
                    ageInDays: updatedRequest.ageInDays,
                    daysUntilEvent: updatedRequest.daysUntilEvent
                },
                
                // Admin Data
                adminNotes: updatedRequest.adminNotes,
                
                // Assignment Details
                assignmentDetails: {
                    assignedBy: req.user.email,
                    assignedAt: updatedRequest.assignedAt,
                    wasOverride: wasOverride,
                    originalSelectedVendorId: vendorRequest.selectedVendorId
                },

                // Notification Status
                notifications: {
                    status: "sent",
                    message: "Assignment notifications are being sent to both client and vendor",
                    expectedDelivery: "within 2-3 minutes"
                }
            };

            res.status(200).json({
                success: true,
                message: "Vendor assigned successfully",
                data: responseData
            });

        } catch (error) {
            console.error("assignVendorToRequest error:", error);

            logger.error("Failed to assign vendor to request", {
                error: error.message,
                stack: error.stack,
                requestId: req.params.requestId,
                assignedVendorId: req.body.assignedVendorId,
                adminId: req.user?.id
            });

            res.status(500).json({
                success: false,
                message: "Failed to assign vendor to request",
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    },

    /**
     * Update vendor request status
     * Admin can update request status (assigned, in_progress, completed, cancelled)
     */
    updateVendorRequestStatus: async (req, res) => {
        try {
            const { requestId } = req.params;
            const { status, adminNotes } = req.body;

            console.log(`Admin updating request ${requestId} status to ${status}`);

            // Validate status
            const allowedStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
                });
            }

            // Find the vendor request
            const vendorRequest = await VendorRequestModel.findOne({
                requestId: parseInt(requestId)
            });

            if (!vendorRequest) {
                return res.status(404).json({
                    success: false,
                    message: "Vendor request not found"
                });
            }

            // Prepare update data
            const updateData = {
                status: status,
                updatedAt: new Date()
            };

            // Add admin notes if provided
            if (adminNotes !== undefined) {
                updateData.adminNotes = adminNotes;
            }

            // Set completion timestamp if status is completed
            if (status === 'completed') {
                updateData.completedAt = new Date();
            }

            // Update the vendor request
            const updatedRequest = await VendorRequestModel.findOneAndUpdate(
                { requestId: parseInt(requestId) },
                updateData,
                { new: true }
            );

            // Log the status update
            logger.info(`Vendor request status updated`, {
                requestId: parseInt(requestId),
                oldStatus: vendorRequest.status,
                newStatus: status,
                clientEmail: vendorRequest.clientInfo.email,
                adminId: req.user.id
            });

            res.status(200).json({
                success: true,
                message: `Request status updated to ${status}`,
                data: {
                    requestId: updatedRequest.requestId,
                    status: updatedRequest.status,
                    statusDisplay: updatedRequest.getStatusDisplay(),
                    adminNotes: updatedRequest.adminNotes,
                    updatedAt: updatedRequest.updatedAt,
                    completedAt: updatedRequest.completedAt
                }
            });

        } catch (error) {
            console.error("updateVendorRequestStatus error:", error);

            logger.error("Failed to update vendor request status", {
                error: error.message,
                stack: error.stack,
                requestId: req.params.requestId,
                status: req.body.status,
                adminId: req.user?.id
            });

            res.status(500).json({
                success: false,
                message: "Failed to update request status",
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
};