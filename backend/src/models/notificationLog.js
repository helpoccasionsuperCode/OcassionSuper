const mongoose = require("mongoose");

const NotificationLogSchema = new mongoose.Schema({
    notificationId: {
        type: Number,
        unique: true,
        index: true,
        default: 1
    },

    // Reference to the related request
    requestId: {
        type: Number,
        required: [true, 'Request ID is required'],
        ref: 'VendorRequest',
        index: true
    },

    // Notification type and details
    notificationType: {
        type: String,
        enum: ['client_assignment', 'vendor_assignment', 'status_update', 'reminder', 'cancellation'],
        required: [true, 'Notification type is required'],
        index: true
    },

    // Recipient information
    recipient: {
        email: {
            type: String,
            required: [true, 'Recipient email is required'],
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
        },
        name: {
            type: String,
            required: [true, 'Recipient name is required'],
            trim: true
        },
        type: {
            type: String,
            enum: ['client', 'vendor', 'admin'],
            required: [true, 'Recipient type is required']
        },
        userId: {
            type: Number,
            required: false // May not always have a user ID (e.g., for clients)
        }
    },

    // Email details
    emailDetails: {
        subject: {
            type: String,
            required: [true, 'Email subject is required'],
            maxlength: [200, 'Subject cannot exceed 200 characters']
        },
        templateUsed: {
            type: String,
            required: [true, 'Template name is required']
        },
        messageId: {
            type: String,
            required: false // Set after successful sending
        },
        priority: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent'],
            default: 'normal'
        }
    },

    // Delivery status
    deliveryStatus: {
        status: {
            type: String,
            enum: ['pending', 'sent', 'delivered', 'failed', 'bounced', 'rejected'],
            default: 'pending',
            index: true
        },
        sentAt: {
            type: Date,
            default: null
        },
        deliveredAt: {
            type: Date,
            default: null
        },
        failureReason: {
            type: String,
            default: null,
            maxlength: [500, 'Failure reason cannot exceed 500 characters']
        },
        retryCount: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        nextRetryAt: {
            type: Date,
            default: null
        }
    },

    // Context data (for tracking and analytics)
    contextData: {
        assignedVendorId: {
            type: Number,
            default: null
        },
        eventType: {
            type: String,
            default: null
        },
        eventDate: {
            type: Date,
            default: null
        },
        urgencyLevel: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: null
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        }
    },

    // Tracking and analytics
    tracking: {
        opened: {
            type: Boolean,
            default: false
        },
        openedAt: {
            type: Date,
            default: null
        },
        clicked: {
            type: Boolean,
            default: false
        },
        clickedAt: {
            type: Date,
            default: null
        },
        userAgent: {
            type: String,
            default: null
        },
        ipAddress: {
            type: String,
            default: null
        }
    },

    // System metadata
    metadata: {
        environment: {
            type: String,
            enum: ['development', 'staging', 'production'],
            default: process.env.NODE_ENV || 'development'
        },
        version: {
            type: String,
            default: '1.0.0'
        },
        source: {
            type: String,
            default: 'assignment-system'
        }
    },

    // Soft delete
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

// Pre-save middleware to generate notificationId
NotificationLogSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastNotification = await this.constructor.findOne({}, {}, { sort: { notificationId: -1 } });
            this.notificationId = lastNotification ? lastNotification.notificationId + 1 : 1;
        } catch (error) {
            console.error('Error generating notificationId:', error);
            this.notificationId = 1; // Fallback
        }
    }
    next();
});

// Virtual for delivery time calculation
NotificationLogSchema.virtual('deliveryTimeMinutes').get(function() {
    if (this.deliveryStatus.sentAt && this.deliveryStatus.deliveredAt) {
        return Math.round((this.deliveryStatus.deliveredAt - this.deliveryStatus.sentAt) / (1000 * 60));
    }
    return null;
});

// Virtual for age calculation
NotificationLogSchema.virtual('ageInHours').get(function() {
    return Math.round((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Virtual for status display
NotificationLogSchema.virtual('statusDisplay').get(function() {
    const statusMap = {
        'pending': 'Pending Send',
        'sent': 'Sent Successfully',
        'delivered': 'Delivered',
        'failed': 'Send Failed',
        'bounced': 'Email Bounced',
        'rejected': 'Email Rejected'
    };
    return statusMap[this.deliveryStatus.status] || this.deliveryStatus.status;
});

// Instance method to mark as sent
NotificationLogSchema.methods.markAsSent = function(messageId) {
    this.deliveryStatus.status = 'sent';
    this.deliveryStatus.sentAt = new Date();
    this.emailDetails.messageId = messageId;
    return this.save();
};

// Instance method to mark as failed
NotificationLogSchema.methods.markAsFailed = function(reason) {
    this.deliveryStatus.status = 'failed';
    this.deliveryStatus.failureReason = reason;
    this.deliveryStatus.retryCount += 1;
    
    // Set next retry time (exponential backoff)
    const retryDelayMinutes = Math.pow(2, this.deliveryStatus.retryCount) * 5; // 5, 10, 20, 40, 80 minutes
    this.deliveryStatus.nextRetryAt = new Date(Date.now() + retryDelayMinutes * 60 * 1000);
    
    return this.save();
};

// Instance method to mark as delivered
NotificationLogSchema.methods.markAsDelivered = function() {
    this.deliveryStatus.status = 'delivered';
    this.deliveryStatus.deliveredAt = new Date();
    return this.save();
};

// Instance method to track email open
NotificationLogSchema.methods.trackOpen = function(userAgent = null, ipAddress = null) {
    if (!this.tracking.opened) {
        this.tracking.opened = true;
        this.tracking.openedAt = new Date();
        this.tracking.userAgent = userAgent;
        this.tracking.ipAddress = ipAddress;
        return this.save();
    }
    return Promise.resolve(this);
};

// Instance method to track email click
NotificationLogSchema.methods.trackClick = function(userAgent = null, ipAddress = null) {
    if (!this.tracking.clicked) {
        this.tracking.clicked = true;
        this.tracking.clickedAt = new Date();
        this.tracking.userAgent = userAgent;
        this.tracking.ipAddress = ipAddress;
        return this.save();
    }
    return Promise.resolve(this);
};

// Static method to get delivery statistics
NotificationLogSchema.statics.getDeliveryStats = function(dateFrom = null, dateTo = null) {
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
                _id: '$deliveryStatus.status',
                count: { $sum: 1 },
                avgDeliveryTime: { $avg: '$deliveryTimeMinutes' }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                statuses: {
                    $push: {
                        status: '$_id',
                        count: '$count',
                        avgDeliveryTime: '$avgDeliveryTime'
                    }
                }
            }
        }
    ]);
};

// Database indexes for performance optimization
NotificationLogSchema.index({ notificationId: 1 }, { unique: true });
NotificationLogSchema.index({ requestId: 1 });
NotificationLogSchema.index({ notificationType: 1, createdAt: -1 });
NotificationLogSchema.index({ 'recipient.email': 1 });
NotificationLogSchema.index({ 'recipient.type': 1 });
NotificationLogSchema.index({ 'deliveryStatus.status': 1 });
NotificationLogSchema.index({ 'deliveryStatus.nextRetryAt': 1 });
NotificationLogSchema.index({ createdAt: -1 });
NotificationLogSchema.index({ isActive: 1, createdAt: -1 });

// Compound indexes for common queries
NotificationLogSchema.index({ requestId: 1, notificationType: 1 });
NotificationLogSchema.index({ 'recipient.email': 1, notificationType: 1 });
NotificationLogSchema.index({ 'deliveryStatus.status': 1, 'deliveryStatus.nextRetryAt': 1 });

const NotificationLogModel = mongoose.model("NotificationLog", NotificationLogSchema);

module.exports = NotificationLogModel;
