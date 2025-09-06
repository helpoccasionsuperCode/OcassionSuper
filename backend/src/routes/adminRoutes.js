const express = require("express");
const router = express.Router();

const { createVendorUser, approveVendor, setUserActiveState, listVendors, updateVendorStatus, listVendorUsers, getVendorById } = require("../controllers/admin");

router.post("/vendors/approve", approveVendor);
router.post("/users/create-vendor", createVendorUser);
router.patch("/users/:user_id/active", setUserActiveState);
router.get("/vendors", listVendors);
router.patch("/vendors/:vendor_id/status", updateVendorStatus);
router.get("/vendors/:vendor_id", getVendorById);
router.get("/users/vendors", listVendorUsers);

module.exports = router; 


