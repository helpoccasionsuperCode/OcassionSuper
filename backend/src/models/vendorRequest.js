const mongoose = require("mongoose");

const VendorRequestSchema = new mongoose.Schema({
    requestId: {
        type: Number,
        unique: true,
        index: true,
        default: 1
    },

    // Client Information
    clientInfo: {
        name: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true,
            minlength: [2, 'Client name must be at least 2 characters'],
            maxlength: [100, 'Client name cannot exceed 100 characters']
        },
        email: {
            type: String,
            required: [true, 'Client email is required'],
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address'
            ]
        },
        phone: {
            type: String,
            required: [true, 'Client phone number is required'],
            trim: true,
            match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'],
            set: function (phone) {
                return phone.replace(/\s+/g, ''); // Remove spaces
            }
        },
        city: {
            type: String,
            required: [true, 'Client city is required'],
            trim: true,
            minlength: [2, 'City name must be at least 2 characters'],
            maxlength: [50, 'City name cannot exceed 50 characters']
        }
    },

    // Event Details
    eventDetails: {
        eventType: {
            type: String,
            required: [true, 'Event type is required'],
            trim: true,
            enum: [
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
            ]
        },
        eventDate: {
            type: Date,
            required: [true, 'Event date is required'],
            validate: {
                validator: function(date) {
                    return date > new Date();
                },
                message: 'Event date must be in the future'
            }
        },
        guestCount: {
            type: Number,
            required: [true, 'Guest count is required'],
            min: [1, 'Guest count must be at least 1'],
            max: [10000, 'Guest count cannot exceed 10,000']
        },
        budget: {
            type: Number,
            required: [true, 'Budget is required'],
            min: [1000, 'Budget must be at least ₹1,000'],
            max: [10000000, 'Budget cannot exceed ₹1,00,00,000']
        },
        location: {
            type: String,
            required: [true, 'Event location is required'],
            trim: true,
            minlength: [5, 'Location must be at least 5 characters'],
            maxlength: [200, 'Location cannot exceed 200 characters']
        },
        specialRequirements: {
            type: String,
            trim: true,
            maxlength: [1000, 'Special requirements cannot exceed 1000 characters'],
            default: ''
        }
    },

    // Vendor Selection
    selectedVendorId: {
        type: Number,
        required: [true, 'Selected vendor ID is required'],
        ref: 'VendorRegister'
    },

    // Admin Assignment
    assignedVendorId: {
        type: Number,
        ref: 'VendorRegister',
        default: null
    },

    // Request Status
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
        index: true
    },

    // Admin Notes
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Admin notes cannot exceed 500 characters'],
        default: ''
    },

    // Timestamps
    assignedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },

    // Additional tracking
    isActive: {
        type: Boolean,
        default: true
    },

    // Assignment tracking
    assignmentHistory: {
        totalReassignments: {
            type: Number,
            default: 0,
            min: 0
        },
        previousVendorIds: {
            type: [Number],
            default: []
        },
        assignmentNotes: {
            type: [String],
            default: []
        }
    },

    // Communication tracking
    communicationLog: {
        vendorFirstContact: {
            type: Date,
            default: null
        },
        vendorResponseTime: {
            type: Number, // Hours
            default: null,
            min: 0
        },
        lastClientContact: {
            type: Date,
            default: null
        },
        totalCommunications: {
            type: Number,
            default: 0,
            min: 0
        }
    },

    // Progress tracking
    progressTracking: {
        milestones: [{
            name: String,
            status: {
                type: String,
                enum: ['pending', 'in_progress', 'completed', 'skipped'],
                default: 'pending'
            },
            dueDate: Date,
            completedDate: Date,
            notes: String
        }],
        overallProgress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        lastProgressUpdate: {
            type: Date,
            default: null
        }
    },

    // Client preferences
    preferences: {
        preferredContactTime: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'anytime'],
            default: 'anytime'
        },
        urgency: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        communicationMethod: {
            type: String,
            enum: ['email', 'phone', 'whatsapp'],
            default: 'email'
        },
        followUpFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'as-needed'],
            default: 'weekly'
        },
        preferredMeetingType: {
            type: String,
            enum: ['in-person', 'video-call', 'phone-call', 'email-only'],
            default: 'phone-call'
        }
    },

    // Quality assurance
    qualityAssurance: {
        adminReviewRequired: {
            type: Boolean,
            default: false
        },
        adminReviewDate: {
            type: Date,
            default: null
        },
        adminReviewNotes: {
            type: String,
            maxlength: [1000, 'Admin review notes cannot exceed 1000 characters'],
            default: ''
        },
        qualityScore: {
            type: Number,
            min: 0,
            max: 10,
            default: null
        }
    },

    // Financial tracking
    financialDetails: {
        quotedAmount: {
            type: Number,
            default: null,
            min: 0
        },
        finalAmount: {
            type: Number,
            default: null,
            min: 0
        },
        advanceAmount: {
            type: Number,
            default: null,
            min: 0
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'advance_paid', 'partially_paid', 'fully_paid', 'refunded'],
            default: 'pending'
        },
        paymentDueDate: {
            type: Date,
            default: null
        }
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to generate requestId
VendorRequestSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastRequest = await this.constructor.findOne({}, {}, { sort: { requestId: -1 } });
            this.requestId = lastRequest ? lastRequest.requestId + 1 : 1;
        } catch (error) {
            console.error('Error generating requestId:', error);
            this.requestId = 1; // Fallback
        }
    }
    next();
});

// Enhanced indexes for better query performance
VendorRequestSchema.index({ requestId: 1 }, { unique: true });
VendorRequestSchema.index({ status: 1, createdAt: -1 });
VendorRequestSchema.index({ selectedVendorId: 1, status: 1 });
VendorRequestSchema.index({ assignedVendorId: 1, status: 1 });
VendorRequestSchema.index({ 'clientInfo.email': 1 });
VendorRequestSchema.index({ 'eventDetails.eventDate': 1 });
VendorRequestSchema.index({ 'eventDetails.eventType': 1 });
VendorRequestSchema.index({ 'clientInfo.city': 1 });
VendorRequestSchema.index({ 'preferences.urgency': 1 });
VendorRequestSchema.index({ isActive: 1, createdAt: -1 });

// Compound indexes for complex queries
VendorRequestSchema.index({ status: 1, 'eventDetails.eventDate': 1 });
VendorRequestSchema.index({ assignedVendorId: 1, status: 1, 'eventDetails.eventDate': 1 });
VendorRequestSchema.index({ 'clientInfo.city': 1, 'eventDetails.eventType': 1 });
VendorRequestSchema.index({ status: 1, 'preferences.urgency': 1, createdAt: -1 });
VendorRequestSchema.index({ 'communicationLog.vendorFirstContact': 1 });
VendorRequestSchema.index({ 'progressTracking.overallProgress': 1 });
VendorRequestSchema.index({ 'financialDetails.paymentStatus': 1 });

// Text index for search functionality
VendorRequestSchema.index({ 
    'clientInfo.name': 'text',
    'eventDetails.location': 'text',
    'eventDetails.specialRequirements': 'text',
    adminNotes: 'text'
});

// Virtual for request age in days
VendorRequestSchema.virtual('ageInDays').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for days until event
VendorRequestSchema.virtual('daysUntilEvent').get(function() {
    return Math.floor((this.eventDetails.eventDate - Date.now()) / (1000 * 60 * 60 * 24));
});

// Instance method to check if request is urgent
VendorRequestSchema.methods.isUrgent = function() {
    const daysUntilEvent = this.daysUntilEvent;
    return daysUntilEvent <= 7 || this.preferences.urgency === 'high';
};

// Instance method to get status display text
VendorRequestSchema.methods.getStatusDisplay = function() {
    const statusMap = {
        'pending': 'Awaiting Assignment',
        'assigned': 'Vendor Assigned',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[this.status] || this.status;
};

// Instance method to update assignment history
VendorRequestSchema.methods.addAssignmentHistory = function(newVendorId, notes = '') {
    if (this.assignedVendorId && this.assignedVendorId !== newVendorId) {
        this.assignmentHistory.previousVendorIds.push(this.assignedVendorId);
        this.assignmentHistory.totalReassignments += 1;
    }
    
    if (notes) {
        this.assignmentHistory.assignmentNotes.push(notes);
    }
    
    return this.save();
};

// Instance method to log communication
VendorRequestSchema.methods.logCommunication = function(type = 'vendor', timestamp = new Date()) {
    this.communicationLog.totalCommunications += 1;
    
    if (type === 'vendor' && !this.communicationLog.vendorFirstContact) {
        this.communicationLog.vendorFirstContact = timestamp;
        
        // Calculate vendor response time
        const responseTimeHours = (timestamp - this.assignedAt) / (1000 * 60 * 60);
        this.communicationLog.vendorResponseTime = Math.round(responseTimeHours * 10) / 10;
    }
    
    if (type === 'client') {
        this.communicationLog.lastClientContact = timestamp;
    }
    
    return this.save();
};

// Instance method to update progress
VendorRequestSchema.methods.updateProgress = function(milestoneUpdates = [], overallProgress = null) {
    if (milestoneUpdates.length > 0) {
        milestoneUpdates.forEach(update => {
            const milestone = this.progressTracking.milestones.find(m => m.name === update.name);
            if (milestone) {
                Object.assign(milestone, update);
                if (update.status === 'completed' && !milestone.completedDate) {
                    milestone.completedDate = new Date();
                }
            } else {
                this.progressTracking.milestones.push(update);
            }
        });
    }
    
    if (overallProgress !== null) {
        this.progressTracking.overallProgress = Math.max(0, Math.min(100, overallProgress));
    }
    
    this.progressTracking.lastProgressUpdate = new Date();
    return this.save();
};

// Instance method to update financial details
VendorRequestSchema.methods.updateFinancials = function(financialUpdate) {
    Object.assign(this.financialDetails, financialUpdate);
    return this.save();
};

// Static method to get assignment statistics
VendorRequestSchema.statics.getAssignmentStats = function(dateFrom = null, dateTo = null) {
    const matchStage = { isActive: true };
    
    if (dateFrom || dateTo) {
        matchStage.createdAt = {};
        if (dateFrom) matchStage.createdAt.$gte = new Date(dateFrom);
        if (dateTo) matchStage.createdAt.$lte = new Date(dateTo);
    }
    
    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgResponseTime: { $avg: '$communicationLog.vendorResponseTime' },
                avgProgress: { $avg: '$progressTracking.overallProgress' }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                statusBreakdown: {
                    $push: {
                        status: '$_id',
                        count: '$count',
                        avgResponseTime: '$avgResponseTime',
                        avgProgress: '$avgProgress'
                    }
                }
            }
        }
    ]);
};

const VendorRequestModel = mongoose.model("VendorRequest", VendorRequestSchema);

module.exports = VendorRequestModel;
