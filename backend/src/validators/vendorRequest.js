const Joi = require('joi');

// Vendor Request Validation Schema
const vendorRequestSchema = Joi.object({
    // Client Information
    clientInfo: Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Client name is required',
                'string.min': 'Client name must be at least 2 characters long',
                'string.max': 'Client name cannot exceed 100 characters',
                'any.required': 'Client name is required'
            }),
        
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'string.empty': 'Client email is required',
                'any.required': 'Client email is required'
            }),
        
        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be exactly 10 digits',
                'string.empty': 'Phone number is required',
                'any.required': 'Phone number is required'
            }),
        
        city: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'City is required',
                'string.min': 'City name must be at least 2 characters long',
                'string.max': 'City name cannot exceed 50 characters',
                'any.required': 'City is required'
            })
    }).required(),

    // Event Details
    eventDetails: Joi.object({
        eventType: Joi.string()
            .valid(
                'Wedding',
                'Birthday Party',
                'Corporate Event',
                'Anniversary',
                'Baby Shower',
                'Graduation',
                'Festival Celebration',
                'Conference',
                'Seminar',
                'Other'
            )
            .required()
            .messages({
                'any.only': 'Event type must be one of the valid options',
                'any.required': 'Event type is required'
            }),
        
        eventDate: Joi.date()
            .greater('now')
            .required()
            .messages({
                'date.greater': 'Event date must be in the future',
                'date.base': 'Please provide a valid event date',
                'any.required': 'Event date is required'
            }),
        
        guestCount: Joi.number()
            .integer()
            .min(1)
            .max(10000)
            .required()
            .messages({
                'number.base': 'Guest count must be a number',
                'number.integer': 'Guest count must be a whole number',
                'number.min': 'Guest count must be at least 1',
                'number.max': 'Guest count cannot exceed 10,000',
                'any.required': 'Guest count is required'
            }),
        
        budget: Joi.number()
            .integer()
            .min(1000)
            .max(10000000)
            .required()
            .messages({
                'number.base': 'Budget must be a number',
                'number.integer': 'Budget must be a whole number',
                'number.min': 'Budget must be at least ₹1,000',
                'number.max': 'Budget cannot exceed ₹1,00,00,000',
                'any.required': 'Budget is required'
            }),
        
        location: Joi.string()
            .min(5)
            .max(200)
            .required()
            .messages({
                'string.empty': 'Event location is required',
                'string.min': 'Location must be at least 5 characters long',
                'string.max': 'Location cannot exceed 200 characters',
                'any.required': 'Event location is required'
            }),
        
        specialRequirements: Joi.string()
            .max(1000)
            .allow('')
            .optional()
            .messages({
                'string.max': 'Special requirements cannot exceed 1000 characters'
            })
    }).required(),

    // Vendor Selection
    selectedVendorId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Selected vendor ID must be a number',
            'number.integer': 'Selected vendor ID must be a whole number',
            'number.positive': 'Selected vendor ID must be a positive number',
            'any.required': 'Selected vendor ID is required'
        }),

    // Client Preferences (Optional)
    preferences: Joi.object({
        preferredContactTime: Joi.string()
            .valid('morning', 'afternoon', 'evening', 'anytime')
            .default('anytime')
            .optional()
            .messages({
                'any.only': 'Preferred contact time must be one of: morning, afternoon, evening, anytime'
            }),
        
        urgency: Joi.string()
            .valid('low', 'medium', 'high')
            .default('medium')
            .optional()
            .messages({
                'any.only': 'Urgency level must be one of: low, medium, high'
            }),
        
        communicationMethod: Joi.string()
            .valid('email', 'phone', 'whatsapp')
            .default('email')
            .optional()
            .messages({
                'any.only': 'Communication method must be one of: email, phone, whatsapp'
            })
    }).optional()
});

// Validation function
const validateVendorRequest = (data) => {
    const { error, value } = vendorRequestSchema.validate(data, {
        abortEarly: false, // Return all validation errors
        stripUnknown: true, // Remove unknown fields
        allowUnknown: false // Don't allow unknown fields
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

// Export validation function and schema
module.exports = {
    validateVendorRequest,
    vendorRequestSchema
};
