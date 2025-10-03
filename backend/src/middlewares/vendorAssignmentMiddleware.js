const { validateVendorAssignment, validateStatusUpdate } = require('../validators/vendorAssignment');

/**
 * Middleware to validate vendor assignment data
 */
const validateVendorAssignmentData = (req, res, next) => {
    try {
        console.log('Validating vendor assignment data...');
        
        const validationResult = validateVendorAssignment(req.body);
        
        if (!validationResult.isValid) {
            console.log('Vendor assignment validation failed:', validationResult.errors);
            
            return res.status(400).json({
                success: false,
                message: 'Vendor assignment validation failed',
                errors: validationResult.errors.map(err => ({
                    field: err.field,
                    message: err.message
                }))
            });
        }
        
        // Set validated data on request object
        req.validatedData = validationResult.value;
        console.log('Vendor assignment validation successful');
        
        next();
        
    } catch (error) {
        console.error('Vendor assignment validation middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Vendor assignment validation error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Middleware to validate status update data
 */
const validateStatusUpdateData = (req, res, next) => {
    try {
        console.log('Validating status update data...');
        
        const validationResult = validateStatusUpdate(req.body);
        
        if (!validationResult.isValid) {
            console.log('Status update validation failed:', validationResult.errors);
            
            return res.status(400).json({
                success: false,
                message: 'Status update validation failed',
                errors: validationResult.errors.map(err => ({
                    field: err.field,
                    message: err.message
                }))
            });
        }
        
        // Set validated data on request object
        req.validatedData = validationResult.value;
        console.log('Status update validation successful');
        
        next();
        
    } catch (error) {
        console.error('Status update validation middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Status update validation error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Middleware to validate request ID parameter for assignments
 */
const validateAssignmentRequestId = (req, res, next) => {
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
        console.error('Assignment request ID validation middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Assignment request ID validation error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Middleware to sanitize vendor assignment data
 */
const sanitizeVendorAssignmentData = (req, res, next) => {
    try {
        if (req.body && req.body.assignedVendorId) {
            // Ensure assignedVendorId is properly converted to integer
            req.body.assignedVendorId = parseInt(req.body.assignedVendorId);
        }
        
        if (req.body && req.body.adminNotes) {
            // Sanitize admin notes
            req.body.adminNotes = req.body.adminNotes.trim();
        }
        
        next();
        
    } catch (error) {
        console.error('Vendor assignment sanitization middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Vendor assignment sanitization error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    validateVendorAssignmentData,
    validateStatusUpdateData,
    validateAssignmentRequestId,
    sanitizeVendorAssignmentData
};
