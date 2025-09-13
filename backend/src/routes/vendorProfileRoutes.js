const express = require("express");
const router = express.Router();

const { getVendorProfile, updateVendorProfile } = require("../controllers/vendorProfile");
const { authenticateToken, authorizeProfileAccess, requireVendorRole } = require("../middlewares/authMiddleware");

// GET /vendor/:userId/profile - Fetch vendor profile data
router.get("/vendor/:userId/profile", authenticateToken, authorizeProfileAccess, requireVendorRole, getVendorProfile);

// PUT /vendor/:userId/profile - Update vendor profile data
router.put("/vendor/:userId/profile", authenticateToken, authorizeProfileAccess, requireVendorRole, updateVendorProfile);

module.exports = router;
