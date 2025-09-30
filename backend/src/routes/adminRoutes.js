const express = require("express");
const router = express.Router();

const { createVendorUser, approveVendor, setUserActiveState, listVendors, updateVendorStatus, listVendorUsers, getVendorById, updateVendorAndUser } = require("../controllers/admin");

router.post("/vendors/approve", approveVendor);
router.post("/users/create-vendor", createVendorUser);
router.patch("/users/:user_id/active", setUserActiveState); 
router.get("/vendors", listVendors);
router.patch("/vendors/:id/status", updateVendorStatus);
router.get("/vendors/:id", getVendorById);
router.get("/users/vendors", listVendorUsers);
router.put("/users/vendor/:vendor_id", updateVendorAndUser);

module.exports = router;


