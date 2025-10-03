const mongoose = require("mongoose");

const ClientFeedbackSchema = new mongoose.Schema({
    feedbackId: {
        type: Number,
        unique: true,
        index: true,
        default: 1
    },

    // Reference to the completed request
    requestId: {
        type: Number,
        required: [true, 'Request ID is required'],
        ref: 'VendorRequest',
        index: true
    },

    // Client information
    clientInfo: {
        name: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true,
            maxlength: [100, 'Client name cannot exceed 100 characters']
        },
        email: {
            type: String,
            required: [true, 'Client email is required'],
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
        },
        phone: {
            type: String,
            required: [true, 'Client phone is required'],
            trim: true,
            match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits']
        }
    },

    // Vendor information
    vendorInfo: {
        vendorId: {
            type: Number,
            required: [true, 'Vendor ID is required'],
            ref: 'VendorRegister'
        },
        businessName: {
            type: String,
            required: [true, 'Business name is required'],
            trim: true
        },
        ownerName: {
            type: String,
            required: [true, 'Owner name is required'],
            trim: true
        }
    },

    // Event details
    eventDetails: {
        eventType: {
            type: String,
            required: [true, 'Event type is required'],
            trim: true
        },
        eventDate: {
            type: Date,
            required: [true, 'Event date is required']
        },
        guestCount: {
            type: Number,
            required: [true, 'Guest count is required'],
            min: 1
        },
        location: {
            type: String,
            required: [true, 'Event location is required'],
            trim: true
        }
    },

    // Overall rating and feedback
    overallRating: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        index: true
    },

    // Detailed ratings
    detailedRatings: {
        communication: {
            type: Number,
            required: [true, 'Communication rating is required'],
            min: 1,
            max: 5
        },
        professionalism: {
            type: Number,
            required: [true, 'Professionalism rating is required'],
            min: 1,
            max: 5
        },
        quality: {
            type: Number,
            required: [true, 'Quality rating is required'],
            min: 1,
            max: 5
        },
        timeliness: {
            type: Number,
            required: [true, 'Timeliness rating is required'],
            min: 1,
            max: 5
        },
        valueForMoney: {
            type: Number,
            required: [true, 'Value for money rating is required'],
            min: 1,
            max: 5
        }
    },

    // Written feedback
    feedback: {
        positives: {
            type: String,
            maxlength: [1000, 'Positive feedback cannot exceed 1000 characters'],
            trim: true,
            default: ''
        },
        improvements: {
            type: String,
            maxlength: [1000, 'Improvement suggestions cannot exceed 1000 characters'],
            trim: true,
            default: ''
        },
        overallComment: {
            type: String,
            required: [true, 'Overall comment is required'],
            maxlength: [2000, 'Overall comment cannot exceed 2000 characters'],
            trim: true,
            minlength: [10, 'Overall comment must be at least 10 characters']
        }
    },

    // Recommendation and satisfaction
    recommendation: {
        wouldRecommend: {
            type: Boolean,
            required: [true, 'Recommendation status is required']
        },
        recommendationReason: {
            type: String,
            maxlength: [500, 'Recommendation reason cannot exceed 500 characters'],
            trim: true,
            default: ''
        },
        likelyToUseAgain: {
            type: Boolean,
            required: [true, 'Future use likelihood is required']
        }
    },

    // Service-specific feedback
    serviceSpecificFeedback: {
        servicesUsed: {
            type: [String],
            required: [true, 'Services used must be specified'],
            validate: {
                validator: function(services) {
                    return services && services.length > 0;
                },
                message: 'At least one service must be specified'
            }
        },
        bestService: {
            type: String,
            trim: true,
            default: ''
        },
        worstService: {
            type: String,
            trim: true,
            default: ''
        },
        additionalServicesWanted: {
            type: [String],
            default: []
        }
    },

    // Response and follow-up
    vendorResponse: {
        hasResponded: {
            type: Boolean,
            default: false
        },
        responseDate: {
            type: Date,
            default: null
        },
        responseText: {
            type: String,
            maxlength: [1000, 'Vendor response cannot exceed 1000 characters'],
            trim: true,
            default: ''
        },
        responseRating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        }
    },

    // Verification and moderation
    verification: {
        isVerified: {
            type: Boolean,
            default: false
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        verificationDate: {
            type: Date,
            default: null
        },
        verificationNotes: {
            type: String,
            maxlength: [500, 'Verification notes cannot exceed 500 characters'],
            default: ''
        }
    },

    // Public display settings
    displaySettings: {
        isPublic: {
            type: Boolean,
            default: true
        },
        showClientName: {
            type: Boolean,
            default: false
        },
        showEventDetails: {
            type: Boolean,
            default: true
        },
        moderationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'flagged'],
            default: 'pending',
            index: true
        },
        moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        moderationDate: {
            type: Date,
            default: null
        },
        moderationNotes: {
            type: String,
            maxlength: [500, 'Moderation notes cannot exceed 500 characters'],
            default: ''
        }
    },

    // Metadata and tracking
    metadata: {
        submissionSource: {
            type: String,
            enum: ['web', 'mobile', 'email', 'phone', 'admin'],
            default: 'web'
        },
        ipAddress: {
            type: String,
            default: null
        },
        userAgent: {
            type: String,
            default: null
        },
        timeToComplete: {
            type: Number, // Time in minutes to complete feedback
            min: 0,
            default: null
        },
        followUpSent: {
            type: Boolean,
            default: false
        },
        followUpDate: {
            type: Date,
            default: null
        }
    },

    // Status and lifecycle
    status: {
        type: String,
        enum: ['draft', 'submitted', 'processed', 'published', 'archived'],
        default: 'submitted',
        index: true
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to generate feedbackId
ClientFeedbackSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastFeedback = await this.constructor.findOne({}, {}, { sort: { feedbackId: -1 } });
            this.feedbackId = lastFeedback ? lastFeedback.feedbackId + 1 : 1;
        } catch (error) {
            console.error('Error generating feedbackId:', error);
            this.feedbackId = 1; // Fallback
        }
    }
    next();
});

// Virtual for average detailed rating
ClientFeedbackSchema.virtual('averageDetailedRating').get(function() {
    const ratings = this.detailedRatings;
    const total = ratings.communication + ratings.professionalism + 
                  ratings.quality + ratings.timeliness + ratings.valueForMoney;
    return Math.round((total / 5) * 10) / 10; // Round to 1 decimal place
});

// Virtual for rating display
ClientFeedbackSchema.virtual('ratingDisplay').get(function() {
    const stars = '★'.repeat(this.overallRating) + '☆'.repeat(5 - this.overallRating);
    return {
        stars: stars,
        numeric: this.overallRating,
        text: `${this.overallRating}/5 stars`
    };
});

// Virtual for feedback summary
ClientFeedbackSchema.virtual('feedbackSummary').get(function() {
    const comment = this.feedback.overallComment;
    return comment.length > 100 ? comment.substring(0, 100) + '...' : comment;
});

// Virtual for client display name
ClientFeedbackSchema.virtual('clientDisplayName').get(function() {
    if (this.displaySettings.showClientName) {
        return this.clientInfo.name;
    }
    return this.clientInfo.name.charAt(0) + '***'; // Show only first letter
});

// Instance method to calculate sentiment score
ClientFeedbackSchema.methods.calculateSentimentScore = function() {
    // Simple sentiment calculation based on ratings and keywords
    const avgRating = this.averageDetailedRating;
    const ratingScore = (avgRating - 1) / 4; // Normalize to 0-1
    
    // Keyword analysis (basic implementation)
    const positiveWords = ['excellent', 'amazing', 'great', 'wonderful', 'fantastic', 'perfect', 'outstanding'];
    const negativeWords = ['terrible', 'awful', 'bad', 'poor', 'disappointing', 'horrible', 'worst'];
    
    const comment = this.feedback.overallComment.toLowerCase();
    const positiveCount = positiveWords.filter(word => comment.includes(word)).length;
    const negativeCount = negativeWords.filter(word => comment.includes(word)).length;
    
    const keywordScore = (positiveCount - negativeCount) / 10; // Normalize
    
    // Combine scores
    const sentimentScore = (ratingScore * 0.7) + (keywordScore * 0.3);
    
    return Math.max(0, Math.min(1, sentimentScore)); // Clamp to 0-1
};

// Instance method to mark as verified
ClientFeedbackSchema.methods.markAsVerified = function(verifiedBy, notes = '') {
    this.verification.isVerified = true;
    this.verification.verifiedBy = verifiedBy;
    this.verification.verificationDate = new Date();
    this.verification.verificationNotes = notes;
    return this.save();
};

// Instance method to moderate feedback
ClientFeedbackSchema.methods.moderate = function(status, moderatedBy, notes = '') {
    this.displaySettings.moderationStatus = status;
    this.displaySettings.moderatedBy = moderatedBy;
    this.displaySettings.moderationDate = new Date();
    this.displaySettings.moderationNotes = notes;
    
    if (status === 'approved') {
        this.status = 'published';
    }
    
    return this.save();
};

// Static method to get vendor rating summary
ClientFeedbackSchema.statics.getVendorRatingSummary = function(vendorId) {
    return this.aggregate([
        { 
            $match: { 
                'vendorInfo.vendorId': vendorId,
                'displaySettings.moderationStatus': 'approved',
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageOverallRating: { $avg: '$overallRating' },
                averageCommunication: { $avg: '$detailedRatings.communication' },
                averageProfessionalism: { $avg: '$detailedRatings.professionalism' },
                averageQuality: { $avg: '$detailedRatings.quality' },
                averageTimeliness: { $avg: '$detailedRatings.timeliness' },
                averageValueForMoney: { $avg: '$detailedRatings.valueForMoney' },
                recommendationCount: {
                    $sum: { $cond: ['$recommendation.wouldRecommend', 1, 0] }
                },
                ratingDistribution: {
                    $push: '$overallRating'
                }
            }
        },
        {
            $addFields: {
                recommendationPercentage: {
                    $multiply: [
                        { $divide: ['$recommendationCount', '$totalReviews'] },
                        100
                    ]
                }
            }
        }
    ]);
};

// Static method to get recent feedback
ClientFeedbackSchema.statics.getRecentFeedback = function(limit = 10, vendorId = null) {
    const matchStage = {
        'displaySettings.moderationStatus': 'approved',
        'displaySettings.isPublic': true,
        isActive: true
    };
    
    if (vendorId) {
        matchStage['vendorInfo.vendorId'] = vendorId;
    }
    
    return this.find(matchStage)
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('feedbackId overallRating feedback.overallComment clientInfo.name vendorInfo.businessName eventDetails.eventType createdAt displaySettings.showClientName')
        .lean();
};

// Database indexes for performance optimization
ClientFeedbackSchema.index({ feedbackId: 1 }, { unique: true });
ClientFeedbackSchema.index({ requestId: 1 }, { unique: true });
ClientFeedbackSchema.index({ 'vendorInfo.vendorId': 1, createdAt: -1 });
ClientFeedbackSchema.index({ overallRating: -1 });
ClientFeedbackSchema.index({ 'displaySettings.moderationStatus': 1 });
ClientFeedbackSchema.index({ status: 1, createdAt: -1 });
ClientFeedbackSchema.index({ isActive: 1, createdAt: -1 });

// Compound indexes for common queries
ClientFeedbackSchema.index({ 'vendorInfo.vendorId': 1, 'displaySettings.moderationStatus': 1 });
ClientFeedbackSchema.index({ 'displaySettings.isPublic': 1, 'displaySettings.moderationStatus': 1, createdAt: -1 });
ClientFeedbackSchema.index({ 'recommendation.wouldRecommend': 1, 'vendorInfo.vendorId': 1 });

const ClientFeedbackModel = mongoose.model("ClientFeedback", ClientFeedbackSchema);

module.exports = ClientFeedbackModel;
