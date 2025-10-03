/**
 * Notification Configuration
 * Settings for the assignment notification system
 */

const notificationConfig = {
    // Email settings
    email: {
        // Sender information
        senderName: "OccasionSuper Assignment Team",
        senderEmail: process.env.SMTP_USER,
        
        // Support contact
        supportEmail: "support@occasionsuper.com",
        vendorSupportEmail: "vendor-support@occasionsuper.com",
        supportPhone: "+91 9870823328",
        
        // Company information
        companyName: "OccasionSuper",
        companyFullName: "GMNP Services and Marketing Pvt Ltd",
        websiteUrl: "https://ocassion-super.vercel.app",
        vendorLoginUrl: "https://ocassion-super.vercel.app/vendor-auth",
        
        // Email delivery settings
        retryAttempts: 3,
        retryDelay: 5000, // 5 seconds
        timeout: 30000, // 30 seconds
    },
    
    // Notification timing
    timing: {
        // Expected delivery times
        expectedDeliveryTime: "2-3 minutes",
        
        // Vendor response expectations
        vendorResponseTime: "24 hours",
        
        // Urgency thresholds (days until event)
        urgencyThresholds: {
            high: 7,    // 7 days or less = HIGH priority
            medium: 14, // 8-14 days = MEDIUM priority
            low: 15     // 15+ days = LOW priority
        }
    },
    
    // Template settings
    templates: {
        // Logo and branding
        logoUrl: "https://via.placeholder.com/140x70/ffffff/667eea?text=OccasionSuper",
        logoAlt: "OccasionSuper Logo",
        
        // Color scheme
        colors: {
            primary: "#667eea",
            secondary: "#764ba2",
            success: "#28a745",
            warning: "#ffc107",
            danger: "#dc3545",
            info: "#17a2b8"
        },
        
        // Common styles
        styles: {
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }
    },
    
    // Notification types
    types: {
        CLIENT_ASSIGNMENT: {
            subject: "🎉 Vendor Assigned for Your {eventType} - Request #{requestId}",
            priority: "normal",
            category: "assignment"
        },
        VENDOR_ASSIGNMENT: {
            subject: "🎯 New Client Assignment - {eventType} Request #{requestId}",
            priority: "high",
            category: "assignment"
        }
    },
    
    // Error handling
    errorHandling: {
        // Whether to continue processing if one notification fails
        continueOnError: true,
        
        // Log levels for different scenarios
        logLevels: {
            success: "info",
            partialFailure: "warn",
            totalFailure: "error"
        }
    },
    
    // Development settings
    development: {
        // Whether to send actual emails in development
        sendEmails: process.env.NODE_ENV === 'production' || process.env.SEND_DEV_EMAILS === 'true',
        
        // Test email addresses for development
        testEmails: {
            client: "test-client@occasionsuper.com",
            vendor: "test-vendor@occasionsuper.com"
        },
        
        // Console logging in development
        logToConsole: process.env.NODE_ENV !== 'production'
    }
};

/**
 * Get urgency level based on days until event
 */
function getUrgencyLevel(daysUntilEvent) {
    const thresholds = notificationConfig.timing.urgencyThresholds;
    
    if (daysUntilEvent <= thresholds.high) {
        return 'HIGH';
    } else if (daysUntilEvent <= thresholds.medium) {
        return 'MEDIUM';
    } else {
        return 'LOW';
    }
}

/**
 * Get urgency color based on level
 */
function getUrgencyColor(urgencyLevel) {
    const colors = notificationConfig.templates.colors;
    
    switch (urgencyLevel) {
        case 'HIGH':
            return colors.danger;
        case 'MEDIUM':
            return colors.warning;
        case 'LOW':
            return colors.success;
        default:
            return colors.info;
    }
}

/**
 * Format subject line with dynamic data
 */
function formatSubject(template, data) {
    return template
        .replace('{eventType}', data.eventType || 'Event')
        .replace('{requestId}', data.requestId || 'N/A');
}

/**
 * Validate notification configuration
 */
function validateConfig() {
    const errors = [];
    
    // Check required email settings
    if (!notificationConfig.email.senderEmail) {
        errors.push('SMTP_USER environment variable is required for sender email');
    }
    
    // Check SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
        errors.push('SMTP_HOST and SMTP_PORT environment variables are required');
    }
    
    if (!process.env.SMTP_PASS) {
        errors.push('SMTP_PASS environment variable is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get notification settings for environment
 */
function getNotificationSettings() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    return {
        ...notificationConfig,
        isDevelopment,
        shouldSendEmails: notificationConfig.development.sendEmails,
        shouldLogToConsole: notificationConfig.development.logToConsole
    };
}

module.exports = {
    notificationConfig,
    getUrgencyLevel,
    getUrgencyColor,
    formatSubject,
    validateConfig,
    getNotificationSettings
};
