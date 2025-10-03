const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },

    clientId: {
        type: Number,
        unique: true,
        default: 1
    },

    // Basic Information
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Invalid mobile number. Please enter exactly 10 digits.'],
        set: function (phone) {
            return phone.replace(/\s+/g, ''); // Remove spaces
        }
    },

    // Event Details
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'festival', 'other'],
        default: 'other'
    },

    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },

    guestCount: {
        type: Number,
        required: [true, 'Guest count is required'],
        min: [1, 'Guest count must be at least 1']
    },

    budget: {
        min: {
            type: Number,
            required: false
        },
        max: {
            type: Number,
            required: [true, 'Maximum budget is required'],
            min: [0, 'Budget cannot be negative']
        }
    },

    // Location Details
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },

    venue: {
        type: String,
        required: false,
        trim: true
    },

    // Requirements
    servicesRequired: {
        type: [String],
        required: [true, 'At least one service is required'],
        enum: ['catering', 'photography', 'decoration', 'music', 'transportation', 'makeup', 'clothing', 'venue', 'other']
    },

    specialRequirements: {
        type: String,
        required: false,
        trim: true,
        maxlength: [1000, 'Special requirements cannot exceed 1000 characters']
    },

    // Status and Tracking
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to generate clientId
ClientSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastClient = await this.constructor.findOne({}, {}, { sort: { clientId: -1 } });
            this.clientId = lastClient ? lastClient.clientId + 1 : 1;
        } catch (error) {
            console.error('Error generating clientId:', error);
            this.clientId = 1; // Fallback
        }
    }
    next();
});

// Indexes for better query performance
ClientSchema.index({ email: 1 }, { unique: true });
ClientSchema.index({ status: 1, city: 1 });
ClientSchema.index({ eventType: 1, servicesRequired: 1 });
ClientSchema.index({ eventDate: 1 });

const ClientModel = mongoose.model("Client", ClientSchema);

module.exports = ClientModel;

