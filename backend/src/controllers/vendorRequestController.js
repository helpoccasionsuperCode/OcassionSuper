const VendorRequestModel = require("../models/vendorRequest");
const vendorRegisterModel = require("../models/vendorRegister");
const logger = require("../utils/logger");

/**
 * Submit a new vendor request from client
 * This creates a pending request that admin will review and assign
 */
const submitVendorRequest = async (req, res) => {
    try {
        console.log("Received vendor request submission:", req.body);

        // Validate that the selected vendor exists and is approved
        const selectedVendor = await vendorRegisterModel.findOne({
            userId: req.body.selectedVendorId,
            status: "approved",
            isActive: true
        });

        if (!selectedVendor) {
            return res.status(404).json({
                success: false,
                message: "Selected vendor not found or not available"
            });
        }

        // Check for duplicate requests from same client for same event date
        const existingRequest = await VendorRequestModel.findOne({
            'clientInfo.email': req.body.clientInfo.email,
            'eventDetails.eventDate': req.body.eventDetails.eventDate,
            status: { $in: ['pending', 'assigned'] }
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending request for this event date",
                data: {
                    existingRequestId: existingRequest.requestId,
                    eventDate: existingRequest.eventDetails.eventDate
                }
            });
        }

        // Create new vendor request
        const vendorRequestData = {
            ...req.body,
            status: 'pending',
            assignedVendorId: null,
            adminNotes: '',
            assignedAt: null,
            completedAt: null
        };

        const vendorRequest = new VendorRequestModel(vendorRequestData);
        await vendorRequest.save();

        console.log("Vendor request created successfully:", vendorRequest.requestId);

        // Log successful request submission
        logger.info(`Vendor request submitted successfully: ${vendorRequest.requestId}`, {
            requestId: vendorRequest.requestId,
            clientEmail: vendorRequest.clientInfo.email,
            selectedVendorId: vendorRequest.selectedVendorId,
            eventType: vendorRequest.eventDetails.eventType,
            eventDate: vendorRequest.eventDetails.eventDate
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: "Vendor request submitted successfully",
            data: {
                requestId: vendorRequest.requestId,
                status: vendorRequest.status,
                clientName: vendorRequest.clientInfo.name,
                eventType: vendorRequest.eventDetails.eventType,
                eventDate: vendorRequest.eventDetails.eventDate,
                selectedVendorId: vendorRequest.selectedVendorId,
                estimatedResponseTime: "24-48 hours",
                nextSteps: [
                    "Your request has been submitted to our admin team",
                    "We will review your requirements and assign the best vendor",
                    "You will receive confirmation within 24-48 hours",
                    "The assigned vendor will contact you directly"
                ]
            }
        });

    } catch (error) {
        console.error("Vendor request submission error:", error);

        // Log error for debugging
        logger.error("Vendor request submission failed", {
            error: error.message,
            stack: error.stack,
            requestData: req.body
        });

        // Handle specific error types
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate request found"
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: "Failed to submit vendor request",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get vendor request status by request ID
 * Allows clients to check the status of their submitted requests
 */
const getVendorRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        console.log(`Fetching vendor request status for ID: ${requestId}`);

        const vendorRequest = await VendorRequestModel.findOne({
            requestId: parseInt(requestId)
        });

        if (!vendorRequest) {
            return res.status(404).json({
                success: false,
                message: "Vendor request not found"
            });
        }

        // Prepare response data
        const responseData = {
            requestId: vendorRequest.requestId,
            status: vendorRequest.status,
            statusDisplay: vendorRequest.getStatusDisplay(),
            clientInfo: {
                name: vendorRequest.clientInfo.name,
                email: vendorRequest.clientInfo.email,
                phone: vendorRequest.clientInfo.phone,
                city: vendorRequest.clientInfo.city
            },
            eventDetails: {
                eventType: vendorRequest.eventDetails.eventType,
                eventDate: vendorRequest.eventDetails.eventDate,
                guestCount: vendorRequest.eventDetails.guestCount,
                budget: vendorRequest.eventDetails.budget,
                location: vendorRequest.eventDetails.location,
                specialRequirements: vendorRequest.eventDetails.specialRequirements
            },
            vendorInfo: {
                selectedVendorId: vendorRequest.selectedVendorId,
                assignedVendorId: vendorRequest.assignedVendorId
            },
            timeline: {
                submittedAt: vendorRequest.createdAt,
                assignedAt: vendorRequest.assignedAt,
                completedAt: vendorRequest.completedAt,
                ageInDays: vendorRequest.ageInDays,
                daysUntilEvent: vendorRequest.daysUntilEvent
            },
            preferences: vendorRequest.preferences,
            isUrgent: vendorRequest.isUrgent()
        };

        // Add admin notes if request is assigned or completed
        if (vendorRequest.status === 'assigned' || vendorRequest.status === 'completed') {
            responseData.adminNotes = vendorRequest.adminNotes;
        }

        // Add assigned vendor details if available
        if (vendorRequest.assignedVendorId) {
            const assignedVendor = await vendorRegisterModel.findOne({
                userId: vendorRequest.assignedVendorId,
                status: "approved",
                isActive: true
            }).select('businessName ownerName email phone');

            if (assignedVendor) {
                responseData.assignedVendorDetails = {
                    businessName: assignedVendor.businessName,
                    ownerName: assignedVendor.ownerName,
                    email: assignedVendor.email,
                    phone: assignedVendor.phone
                };
            }
        }

        logger.info(`Vendor request status fetched successfully`, {
            requestId: vendorRequest.requestId,
            status: vendorRequest.status,
            clientEmail: vendorRequest.clientInfo.email
        });

        res.status(200).json({
            success: true,
            message: "Vendor request status fetched successfully",
            data: responseData
        });

    } catch (error) {
        console.error("getVendorRequestStatus error:", error);

        logger.error("Failed to fetch vendor request status", {
            error: error.message,
            stack: error.stack,
            requestId: req.params.requestId
        });

        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor request status",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get all vendor requests for a specific client by email
 * Allows clients to view all their submitted requests
 */
const getClientVendorRequests = async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`Fetching vendor requests for client: ${email}`);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const vendorRequests = await VendorRequestModel.find({
            'clientInfo.email': email
        })
        .sort({ createdAt: -1 })
        .select({
            requestId: 1,
            status: 1,
            'clientInfo.name': 1,
            'eventDetails.eventType': 1,
            'eventDetails.eventDate': 1,
            'eventDetails.guestCount': 1,
            'eventDetails.budget': 1,
            selectedVendorId: 1,
            assignedVendorId: 1,
            assignedAt: 1,
            completedAt: 1,
            createdAt: 1
        });

        // Transform data for client view
        const clientRequests = vendorRequests.map(request => ({
            requestId: request.requestId,
            status: request.status,
            statusDisplay: request.getStatusDisplay(),
            eventType: request.eventDetails.eventType,
            eventDate: request.eventDetails.eventDate,
            guestCount: request.eventDetails.guestCount,
            budget: request.eventDetails.budget,
            selectedVendorId: request.selectedVendorId,
            assignedVendorId: request.assignedVendorId,
            submittedAt: request.createdAt,
            assignedAt: request.assignedAt,
            completedAt: request.completedAt,
            ageInDays: request.ageInDays,
            daysUntilEvent: request.daysUntilEvent
        }));

        logger.info(`Client vendor requests fetched successfully`, {
            clientEmail: email,
            requestCount: clientRequests.length
        });

        res.status(200).json({
            success: true,
            message: "Client vendor requests fetched successfully",
            data: {
                requests: clientRequests,
                totalRequests: clientRequests.length,
                summary: {
                    pending: clientRequests.filter(r => r.status === 'pending').length,
                    assigned: clientRequests.filter(r => r.status === 'assigned').length,
                    completed: clientRequests.filter(r => r.status === 'completed').length,
                    cancelled: clientRequests.filter(r => r.status === 'cancelled').length
                }
            }
        });

    } catch (error) {
        console.error("getClientVendorRequests error:", error);

        logger.error("Failed to fetch client vendor requests", {
            error: error.message,
            stack: error.stack,
            clientEmail: req.params.email
        });

        res.status(500).json({
            success: false,
            message: "Failed to fetch client vendor requests",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    submitVendorRequest,
    getVendorRequestStatus,
    getClientVendorRequests
};
