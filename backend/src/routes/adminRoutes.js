const express = require("express");
const router = express.Router();

const { createVendorUser, approveVendor, setUserActiveState, listVendors, updateVendorStatus, listVendorUsers, getVendorById, updateVendorAndUser, getAllVendorRequests, assignVendorToRequest, updateVendorRequestStatus } = require("../controllers/admin");
const { authenticateToken, requireAdminRole } = require("../middlewares/authMiddleware");
const { validateVendorAssignmentData, validateStatusUpdateData, validateAssignmentRequestId, sanitizeVendorAssignmentData } = require("../middlewares/vendorAssignmentMiddleware");

router.post("/vendors/approve", approveVendor);
router.post("/users/create-vendor", createVendorUser);
router.patch("/users/:user_id/active", setUserActiveState); 
router.get("/vendors", listVendors);
router.patch("/vendors/:id/status", updateVendorStatus);
router.get("/vendors/:id", getVendorById);
router.get("/users/vendors", listVendorUsers);
router.put("/users/vendor/:vendor_id", updateVendorAndUser);

// Vendor Request Management Routes
router.get("/vendor-requests", authenticateToken, requireAdminRole, getAllVendorRequests);

// Vendor Assignment Routes
router.post("/vendor-requests/:requestId/assign", 
    authenticateToken, 
    requireAdminRole, 
    validateAssignmentRequestId,
    sanitizeVendorAssignmentData,
    validateVendorAssignmentData,
    assignVendorToRequest
);

router.patch("/vendor-requests/:requestId/status", 
    authenticateToken, 
    requireAdminRole, 
    validateAssignmentRequestId,
    validateStatusUpdateData,
    updateVendorRequestStatus
);

module.exports = router;


