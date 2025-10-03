const Joi = require('joi');

// Vendor Assignment Validation Schema
const vendorAssignmentSchema = Joi.object({
    assignedVendorId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Assigned vendor ID must be a number',
            'number.integer': 'Assigned vendor ID must be a whole number',
            'number.positive': 'Assigned vendor ID must be a positive number',
            'any.required': 'Assigned vendor ID is required'
        }),

    adminNotes: Joi.string()
        .max(500)
        .allow('')
        .optional()
        .messages({
            'string.max': 'Admin notes cannot exceed 500 characters'
        })
});

// Status Update Validation Schema
const statusUpdateSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'assigned', 'in_progress', 'completed', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of: pending, assigned, in_progress, completed, cancelled',
            'any.required': 'Status is required'
        }),

    adminNotes: Joi.string()
        .max(500)
        .allow('')
        .optional()
        .messages({
            'string.max': 'Admin notes cannot exceed 500 characters'
        })
});

// Validation functions
const validateVendorAssignment = (data) => {
    const { error, value } = vendorAssignmentSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
        }));

        return {
            isValid: false,
            errors: errors,
            value: null
        };
    }

    return {
        isValid: true,
        errors: null,
        value: value
    };
};

const validateStatusUpdate = (data) => {
    const { error, value } = statusUpdateSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
        }));

        return {
            isValid: false,
            errors: errors,
            value: null
        };
    }

    return {
        isValid: true,
        errors: null,
        value: value
    };
};

module.exports = {
    validateVendorAssignment,
    validateStatusUpdate,
    vendorAssignmentSchema,
    statusUpdateSchema
};
