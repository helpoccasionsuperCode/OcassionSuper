const { validateVendorRequest } = require('../validators/vendorRequest');

/**
 * Middleware to validate vendor request data
 * Validates request body and sets validatedData on req object
 */
const validateVendorRequestData = (req, res, next) => {
    try {
        console.log('Validating vendor request data...');
        
        // Validate the request data
        const validationResult = validateVendorRequest(req.body);
        
        if (!validationResult.isValid) {
            console.log('Validation failed:', validationResult.errors);
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationResult.errors.map(err => ({
                    field: err.field,
                    message: err.message
                }))
            });
        }
        
        // Set validated data on request object
        req.validatedData = validationResult.value;
        console.log('Validation successful');
        
        next();
        
    } catch (error) {
        console.error('Validation middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Validation error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Middleware to sanitize vendor request data
 * Removes any potentially harmful data and normalizes fields
 */
const sanitizeVendorRequestData = (req, res, next) => {
    try {
        if (req.body && req.body.clientInfo) {
            // Sanitize client info
            if (req.body.clientInfo.name) {
                req.body.clientInfo.name = req.body.clientInfo.name.trim();
            }
            if (req.body.clientInfo.email) {
                req.body.clientInfo.email = req.body.clientInfo.email.toLowerCase().trim();
            }
            if (req.body.clientInfo.phone) {
                req.body.clientInfo.phone = req.body.clientInfo.phone.replace(/\s+/g, '');
            }
            if (req.body.clientInfo.city) {
                req.body.clientInfo.city = req.body.clientInfo.city.trim();
            }
        }
        
        if (req.body && req.body.eventDetails) {
            // Sanitize event details
            if (req.body.eventDetails.location) {
                req.body.eventDetails.location = req.body.eventDetails.location.trim();
            }
            if (req.body.eventDetails.specialRequirements) {
                req.body.eventDetails.specialRequirements = req.body.eventDetails.specialRequirements.trim();
            }
            
            // Ensure numeric fields are properly converted
            if (req.body.eventDetails.guestCount) {
                req.body.eventDetails.guestCount = parseInt(req.body.eventDetails.guestCount);
            }
            if (req.body.eventDetails.budget) {
                req.body.eventDetails.budget = parseInt(req.body.eventDetails.budget);
            }
        }
        
        // Sanitize vendor ID
        if (req.body.selectedVendorId) {
            req.body.selectedVendorId = parseInt(req.body.selectedVendorId);
        }
        
        next();
        
    } catch (error) {
        console.error('Sanitization middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Data sanitization error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Middleware to validate email format for client requests lookup
 */
const validateEmailParam = (req, res, next) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        next();
        
    } catch (error) {
        console.error('Email validation middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Email validation error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Middleware to validate request ID parameter
 */
const validateRequestIdParam = (req, res, next) => {
    try {
        const { requestId } = req.params;
        
        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: 'Request ID parameter is required'
            });
        }
        
        // Validate request ID is a positive integer
        const requestIdNum = parseInt(requestId);
        if (isNaN(requestIdNum) || requestIdNum <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Request ID must be a positive number'
            });
        }
        
        // Add parsed request ID to request object
        req.parsedRequestId = requestIdNum;
        
        next();
        
    } catch (error) {
        console.error('Request ID validation middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Request ID validation error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    validateVendorRequestData,
    sanitizeVendorRequestData,
    validateEmailParam,
    validateRequestIdParam
};
