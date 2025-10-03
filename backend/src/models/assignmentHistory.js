const mongoose = require("mongoose");

const AssignmentHistorySchema = new mongoose.Schema({
    historyId: {
        type: Number,
        unique: true,
        index: true,
        default: 1
    },

    // Reference to the vendor request
    requestId: {
        type: Number,
        required: [true, 'Request ID is required'],
        ref: 'VendorRequest',
        index: true
    },

    // Assignment action details
    action: {
        type: String,
        enum: [
            'request_created',
            'vendor_assigned', 
            'vendor_reassigned',
            'status_updated',
            'assignment_cancelled',
            'request_completed',
            'admin_note_added',
            'client_feedback_received',
            'vendor_response_received'
        ],
        required: [true, 'Action type is required'],
        index: true
    },

    // Actor information (who performed the action)
    actor: {
        type: {
            type: String,
            enum: ['admin', 'vendor', 'client', 'system'],
            required: [true, 'Actor type is required']
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        email: {
            type: String,
            required: [true, 'Actor email is required'],
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Actor name is required'],
            trim: true
        }
    },

    // Assignment details
    assignmentDetails: {
        previousVendorId: {
            type: Number,
            default: null
        },
        newVendorId: {
            type: Number,
            default: null
        },
        previousStatus: {
            type: String,
            default: null
        },
        newStatus: {
            type: String,
            default: null
        },
        wasOverride: {
            type: Boolean,
            default: false
        },
        originalSelectedVendorId: {
            type: Number,
            default: null
        }
    },

    // Change description and notes
    description: {
        type: String,
        required: [true, 'Action description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        default: ''
    },

    // Context data for the action
    contextData: {
        clientInfo: {
            name: String,
            email: String,
            phone: String,
            city: String
        },
        eventDetails: {
            eventType: String,
            eventDate: Date,
            guestCount: Number,
            budget: Number,
            location: String
        },
        vendorInfo: {
            businessName: String,
            ownerName: String,
            email: String,
            phone: String,
            city: String
        }
    },

    // System metadata
    metadata: {
        ipAddress: {
            type: String,
            default: null
        },
        userAgent: {
            type: String,
            default: null
        },
        sessionId: {
            type: String,
            default: null
        },
        requestSource: {
            type: String,
            enum: ['web', 'mobile', 'api', 'admin_panel', 'system'],
            default: 'web'
        },
        environment: {
            type: String,
            enum: ['development', 'staging', 'production'],
            default: process.env.NODE_ENV || 'development'
        }
    },

    // Timing information
    timing: {
        actionTimestamp: {
            type: Date,
            default: Date.now,
            index: true
        },
        processingTimeMs: {
            type: Number,
            default: null,
            min: 0
        },
        responseTime: {
            type: Number,
            default: null,
            min: 0
        }
    },

    // Impact tracking
    impact: {
        notificationsSent: {
            type: Number,
            default: 0,
            min: 0
        },
        affectedUsers: {
            type: [String], // Array of user emails affected by this action
            default: []
        },
        systemChanges: {
            type: [String], // Array of system changes made
            default: []
        }
    },

    // Soft delete and status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    // Revision tracking
    revisionNumber: {
        type: Number,
        default: 1,
        min: 1
    },

    // Related history entries
    relatedHistoryIds: {
        type: [Number],
        default: []
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to generate historyId
AssignmentHistorySchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastHistory = await this.constructor.findOne({}, {}, { sort: { historyId: -1 } });
            this.historyId = lastHistory ? lastHistory.historyId + 1 : 1;
        } catch (error) {
            console.error('Error generating historyId:', error);
            this.historyId = 1; // Fallback
        }
    }
    next();
});

// Virtual for age calculation
AssignmentHistorySchema.virtual('ageInHours').get(function() {
    return Math.round((Date.now() - this.timing.actionTimestamp) / (1000 * 60 * 60));
});

// Virtual for action display
AssignmentHistorySchema.virtual('actionDisplay').get(function() {
    const actionMap = {
        'request_created': 'Request Created',
        'vendor_assigned': 'Vendor Assigned',
        'vendor_reassigned': 'Vendor Reassigned',
        'status_updated': 'Status Updated',
        'assignment_cancelled': 'Assignment Cancelled',
        'request_completed': 'Request Completed',
        'admin_note_added': 'Admin Note Added',
        'client_feedback_received': 'Client Feedback Received',
        'vendor_response_received': 'Vendor Response Received'
    };
    return actionMap[this.action] || this.action;
});

// Virtual for summary text
AssignmentHistorySchema.virtual('summaryText').get(function() {
    const actor = this.actor.name || this.actor.email;
    const action = this.actionDisplay;
    const timestamp = this.timing.actionTimestamp.toLocaleString();
    
    return `${actor} ${action.toLowerCase()} on ${timestamp}`;
});

// Instance method to add related history
AssignmentHistorySchema.methods.addRelatedHistory = function(historyId) {
    if (!this.relatedHistoryIds.includes(historyId)) {
        this.relatedHistoryIds.push(historyId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Static method to create assignment history entry
AssignmentHistorySchema.statics.createEntry = function(data) {
    const historyEntry = new this({
        requestId: data.requestId,
        action: data.action,
        actor: data.actor,
        assignmentDetails: data.assignmentDetails || {},
        description: data.description,
        notes: data.notes || '',
        contextData: data.contextData || {},
        metadata: data.metadata || {},
        timing: {
            actionTimestamp: new Date(),
            processingTimeMs: data.processingTimeMs || null,
            responseTime: data.responseTime || null
        },
        impact: data.impact || {}
    });
    
    return historyEntry.save();
};

// Static method to get request timeline
AssignmentHistorySchema.statics.getRequestTimeline = function(requestId) {
    return this.find({ 
        requestId: requestId, 
        isActive: true 
    })
    .sort({ 'timing.actionTimestamp': 1 })
    .populate('actor.userId', 'email role')
    .lean();
};

// Static method to get admin activity report
AssignmentHistorySchema.statics.getAdminActivityReport = function(dateFrom = null, dateTo = null) {
    const matchStage = { 
        'actor.type': 'admin',
        isActive: true 
    };
    
    if (dateFrom || dateTo) {
        matchStage['timing.actionTimestamp'] = {};
        if (dateFrom) matchStage['timing.actionTimestamp'].$gte = new Date(dateFrom);
        if (dateTo) matchStage['timing.actionTimestamp'].$lte = new Date(dateTo);
    }
    
    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: {
                    adminEmail: '$actor.email',
                    action: '$action'
                },
                count: { $sum: 1 },
                lastAction: { $max: '$timing.actionTimestamp' }
            }
        },
        {
            $group: {
                _id: '$_id.adminEmail',
                actions: {
                    $push: {
                        action: '$_id.action',
                        count: '$count',
                        lastAction: '$lastAction'
                    }
                },
                totalActions: { $sum: '$count' }
            }
        },
        { $sort: { totalActions: -1 } }
    ]);
};

// Static method to get vendor assignment statistics
AssignmentHistorySchema.statics.getVendorAssignmentStats = function(vendorId = null, dateFrom = null, dateTo = null) {
    const matchStage = { 
        action: { $in: ['vendor_assigned', 'vendor_reassigned'] },
        isActive: true 
    };
    
    if (vendorId) {
        matchStage['assignmentDetails.newVendorId'] = vendorId;
    }
    
    if (dateFrom || dateTo) {
        matchStage['timing.actionTimestamp'] = {};
        if (dateFrom) matchStage['timing.actionTimestamp'].$gte = new Date(dateFrom);
        if (dateTo) matchStage['timing.actionTimestamp'].$lte = new Date(dateTo);
    }
    
    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$assignmentDetails.newVendorId',
                totalAssignments: { $sum: 1 },
                reassignments: {
                    $sum: { $cond: [{ $eq: ['$action', 'vendor_reassigned'] }, 1, 0] }
                },
                overrides: {
                    $sum: { $cond: ['$assignmentDetails.wasOverride', 1, 0] }
                },
                lastAssignment: { $max: '$timing.actionTimestamp' }
            }
        },
        { $sort: { totalAssignments: -1 } }
    ]);
};

// Database indexes for performance optimization
AssignmentHistorySchema.index({ historyId: 1 }, { unique: true });
AssignmentHistorySchema.index({ requestId: 1, 'timing.actionTimestamp': -1 });
AssignmentHistorySchema.index({ action: 1, 'timing.actionTimestamp': -1 });
AssignmentHistorySchema.index({ 'actor.type': 1, 'timing.actionTimestamp': -1 });
AssignmentHistorySchema.index({ 'actor.email': 1, 'timing.actionTimestamp': -1 });
AssignmentHistorySchema.index({ 'assignmentDetails.newVendorId': 1 });
AssignmentHistorySchema.index({ 'timing.actionTimestamp': -1 });
AssignmentHistorySchema.index({ isActive: 1, 'timing.actionTimestamp': -1 });

// Compound indexes for common queries
AssignmentHistorySchema.index({ requestId: 1, action: 1 });
AssignmentHistorySchema.index({ 'actor.type': 1, action: 1, 'timing.actionTimestamp': -1 });
AssignmentHistorySchema.index({ 'assignmentDetails.newVendorId': 1, action: 1 });

const AssignmentHistoryModel = mongoose.model("AssignmentHistory", AssignmentHistorySchema);

module.exports = AssignmentHistoryModel;
