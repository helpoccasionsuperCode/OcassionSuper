const mongoose = require("mongoose");

const VendorRegister = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },

    userId: {
        type: Number,
        unique: true,
        default: 1
    },

    businessName: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /@gmail\.com$/,
            'Email must contain @gmail.com'
        ],
        lowercase: true,
        trim: true
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

    city: {
        type: String,
        required: true
    },
    serviceArea: {
        type: String,
        required: true
    },

    socialMedia: {
        type: String,
        required: false,
        default: null,
        trim: true
    },

    categories: {
        type: [String],
        required: true
    },
    othersCategories: {
        type: [String],
        required: false,
        default: []
    },

    images: {
        type: [String],
        required: false,
        default: null
    },

    videos: {
        type: [String],
        required: false,
        default: null
    },

    packages: {
        type: [Object],
        required: false,
        default: []
    },

    documents: {
        gst: {
            type: [String],
            required: false,
            default: null
        },
        businessProof: {
            type: [String],
            required: false,
            default: null
        },
        idProof: {
            type: [String],
            required: false,
            default: null
        }
    },

    bankDetails: {
        accountHolder: {
            type: String,
            required: false,
            default: null
        },
        accountNumber: {
            type: String,
            required: false,
            default: null
        },
        ifsc: {
            type: String,
            required: false,
            default: null
        }
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    verificationStatus: {
        emailVerified: {
            type: Boolean,
            default: false
        },
        phoneVerified: {
            type: Boolean,
            default: false
        },
        documentsVerified: {
            type: Boolean,
            default: false
        }
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // Public visibility and assignment system fields
    isPubliclyVisible: {
        type: Boolean,
        default: true,
        index: true
    },
    
    displayPriority: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    // Rating and performance tracking
    clientRating: {
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0,
            min: 0
        },
        ratingBreakdown: {
            fiveStars: { type: Number, default: 0 },
            fourStars: { type: Number, default: 0 },
            threeStars: { type: Number, default: 0 },
            twoStars: { type: Number, default: 0 },
            oneStar: { type: Number, default: 0 }
        }
    },

    // Response time tracking
    responseTime: {
        type: String,
        enum: ['immediate', 'within-2h', 'within-24h', 'within-48h', 'slow'],
        default: 'within-24h'
    },

    // Performance metrics
    performanceMetrics: {
        totalAssignments: {
            type: Number,
            default: 0
        },
        completedAssignments: {
            type: Number,
            default: 0
        },
        cancelledAssignments: {
            type: Number,
            default: 0
        },
        averageResponseTimeHours: {
            type: Number,
            default: 24
        },
        lastAssignmentDate: {
            type: Date,
            default: null
        },
        successRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // Availability tracking
    availability: {
        status: {
            type: String,
            enum: ['available', 'busy', 'unavailable', 'vacation'],
            default: 'available'
        },
        nextAvailableDate: {
            type: Date,
            default: null
        },
        maxConcurrentEvents: {
            type: Number,
            default: 5,
            min: 1
        },
        currentActiveEvents: {
            type: Number,
            default: 0,
            min: 0
        }
    },

    // Business profile enhancements
    businessProfile: {
        description: {
            type: String,
            maxlength: [2000, 'Business description cannot exceed 2000 characters'],
            default: ''
        },
        yearsOfExperience: {
            type: Number,
            min: 0,
            max: 50,
            default: 0
        },
        teamSize: {
            type: Number,
            min: 1,
            default: 1
        },
        specializations: {
            type: [String],
            default: []
        },
        workingHours: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '18:00' },
            timezone: { type: String, default: 'Asia/Kolkata' }
        }
    },

    // Contact preferences
    contactPreferences: {
        preferredContactMethod: {
            type: String,
            enum: ['email', 'phone', 'whatsapp', 'any'],
            default: 'any'
        },
        responseTimeCommitment: {
            type: String,
            enum: ['immediate', '2-hours', '24-hours', '48-hours'],
            default: '24-hours'
        },
        availableForUrgentRequests: {
            type: Boolean,
            default: true
        }
    },

    // Admin management fields
    adminNotes: {
        type: String,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
        default: ''
    },

    lastReviewDate: {
        type: Date,
        default: null
    },

    // updation (existing fields)
    profilePhoto: { type: String, default: "" },
    upiId: { type: String, default: "" },


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to generate userId
VendorRegister.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastUser = await this.constructor.findOne({}, {}, { sort: { userId: -1 } });
            this.userId = lastUser ? lastUser.userId + 1 : 1;
        } catch (error) {
            console.error('Error generating userId:', error);
            this.userId = 1; // Fallback
        }
    }
    next();
});

// Virtual for calculating success rate
VendorRegister.virtual('calculatedSuccessRate').get(function() {
    if (this.performanceMetrics.totalAssignments === 0) return 0;
    return Math.round((this.performanceMetrics.completedAssignments / this.performanceMetrics.totalAssignments) * 100);
});

// Virtual for availability status
VendorRegister.virtual('isAvailable').get(function() {
    return this.availability.status === 'available' && 
           this.availability.currentActiveEvents < this.availability.maxConcurrentEvents;
});

// Virtual for rating display
VendorRegister.virtual('ratingDisplay').get(function() {
    return {
        stars: Math.round(this.clientRating.averageRating * 2) / 2, // Round to nearest 0.5
        count: this.clientRating.totalReviews,
        text: this.clientRating.totalReviews > 0 ? 
              `${this.clientRating.averageRating.toFixed(1)} (${this.clientRating.totalReviews} reviews)` : 
              'No reviews yet'
    };
});

// Instance method to update performance metrics
VendorRegister.methods.updatePerformanceMetrics = function(assignmentResult) {
    this.performanceMetrics.totalAssignments += 1;
    
    if (assignmentResult === 'completed') {
        this.performanceMetrics.completedAssignments += 1;
    } else if (assignmentResult === 'cancelled') {
        this.performanceMetrics.cancelledAssignments += 1;
    }
    
    this.performanceMetrics.successRate = this.calculatedSuccessRate;
    this.performanceMetrics.lastAssignmentDate = new Date();
    
    return this.save();
};

// Instance method to add rating
VendorRegister.methods.addRating = function(rating, review = null) {
    const ratingNum = Math.max(1, Math.min(5, Math.round(rating)));
    
    // Update rating breakdown
    const ratingKey = ['oneStar', 'twoStars', 'threeStars', 'fourStars', 'fiveStars'][ratingNum - 1];
    this.clientRating.ratingBreakdown[ratingKey] += 1;
    
    // Update totals
    this.clientRating.totalReviews += 1;
    
    // Recalculate average rating
    const totalPoints = 
        (this.clientRating.ratingBreakdown.oneStar * 1) +
        (this.clientRating.ratingBreakdown.twoStars * 2) +
        (this.clientRating.ratingBreakdown.threeStars * 3) +
        (this.clientRating.ratingBreakdown.fourStars * 4) +
        (this.clientRating.ratingBreakdown.fiveStars * 5);
    
    this.clientRating.averageRating = totalPoints / this.clientRating.totalReviews;
    
    return this.save();
};

// Database indexes for performance optimization
VendorRegister.index({ email: 1 }, { unique: true });
VendorRegister.index({ userId: 1 }, { unique: true });
VendorRegister.index({ status: 1, isActive: 1 });
VendorRegister.index({ status: 1, isPubliclyVisible: 1 });
VendorRegister.index({ city: 1, categories: 1 });
VendorRegister.index({ 'clientRating.averageRating': -1 });
VendorRegister.index({ displayPriority: -1 });
VendorRegister.index({ 'availability.status': 1 });
VendorRegister.index({ 'performanceMetrics.successRate': -1 });
VendorRegister.index({ createdAt: -1 });

const VendorRegisterModel = mongoose.model("VendorRegister", VendorRegister);

module.exports = VendorRegisterModel;