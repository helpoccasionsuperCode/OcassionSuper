const express = require("express");
const { 
    getPublicVendors, 
    getPublicVendorById 
} = require("../controllers/publicController");
const {
    submitVendorRequest,
    getVendorRequestStatus,
    getClientVendorRequests
} = require("../controllers/vendorRequestController");
const {
    validateVendorRequestData,
    sanitizeVendorRequestData,
    validateEmailParam,
    validateRequestIdParam
} = require("../middlewares/vendorRequestMiddleware");

const router = express.Router();

// Public vendor browsing routes (no authentication required)
router.get("/vendors", getPublicVendors);
router.get("/vendors/:id", getPublicVendorById);

// Vendor request submission routes (no authentication required)
router.post("/vendor-requests", 
    sanitizeVendorRequestData,
    validateVendorRequestData,
    submitVendorRequest
);

router.get("/vendor-requests/:requestId", 
    validateRequestIdParam,
    getVendorRequestStatus
);

router.get("/client-requests/:email", 
    validateEmailParam,
    getClientVendorRequests
);

module.exports = router;
