# Database Schema Documentation

## Overview

This document outlines the complete database schema for the OccasionSuper vendor-to-client assignment system. The schema is designed to support a comprehensive event management platform with vendor assignment, client management, notification tracking, and performance analytics.

## Database Models

### 1. **VendorRegister** - Enhanced Vendor Management
**File:** `src/models/vendorRegister.js`

#### Core Business Information
- `userId` (Number, unique): Auto-generated vendor ID
- `businessName` (String): Business name
- `ownerName` (String): Owner/contact person name
- `email` (String, unique): Business email (@gmail.com required)
- `phone` (String): 10-digit phone number
- `city` (String): Primary business location
- `serviceArea` (String): Service coverage area
- `categories` (Array): Service categories offered
- `othersCategories` (Array): Custom service categories

#### Media and Portfolio
- `images` (Array): Portfolio images
- `videos` (Array): Portfolio videos
- `packages` (Array): Service packages offered
- `profilePhoto` (String): Business profile photo
- `socialMedia` (String): Social media links

#### Business Documentation
- `documents.gst` (Array): GST registration documents
- `documents.businessProof` (Array): Business proof documents
- `documents.idProof` (Array): Identity proof documents
- `bankDetails`: Account holder, number, IFSC code
- `upiId` (String): UPI payment ID

#### **NEW: Assignment System Fields**
```javascript
// Public visibility control
isPubliclyVisible: Boolean (default: true)
displayPriority: Number (0-100, for search ranking)

// Rating and performance tracking
clientRating: {
    averageRating: Number (0-5),
    totalReviews: Number,
    ratingBreakdown: {
        fiveStars: Number,
        fourStars: Number,
        threeStars: Number,
        twoStars: Number,
        oneStar: Number
    }
}

// Response time tracking
responseTime: String (immediate, within-2h, within-24h, within-48h, slow)

// Performance metrics
performanceMetrics: {
    totalAssignments: Number,
    completedAssignments: Number,
    cancelledAssignments: Number,
    averageResponseTimeHours: Number,
    lastAssignmentDate: Date,
    successRate: Number (0-100)
}

// Availability management
availability: {
    status: String (available, busy, unavailable, vacation),
    nextAvailableDate: Date,
    maxConcurrentEvents: Number,
    currentActiveEvents: Number
}

// Enhanced business profile
businessProfile: {
    description: String (max 2000 chars),
    yearsOfExperience: Number,
    teamSize: Number,
    specializations: Array,
    workingHours: {
        start: String,
        end: String,
        timezone: String
    }
}

// Contact preferences
contactPreferences: {
    preferredContactMethod: String (email, phone, whatsapp, any),
    responseTimeCommitment: String,
    availableForUrgentRequests: Boolean
}
```

#### Status and Verification
- `status`: pending, approved, rejected, suspended
- `verificationStatus`: Email, phone, documents verification
- `isActive` (Boolean): Account active status
- `adminNotes` (String): Admin management notes
- `lastReviewDate` (Date): Last admin review

#### Virtual Properties and Methods
- `calculatedSuccessRate`: Auto-calculated success percentage
- `isAvailable`: Availability status check
- `ratingDisplay`: Formatted rating display
- `updatePerformanceMetrics()`: Update assignment statistics
- `addRating()`: Add new client rating

---

### 2. **VendorRequest** - Enhanced Request Management
**File:** `src/models/vendorRequest.js`

#### Request Identification
- `requestId` (Number, unique): Auto-generated request ID

#### Client Information
```javascript
clientInfo: {
    name: String (required, 2-100 chars),
    email: String (required, valid email),
    phone: String (required, 10 digits),
    city: String (required, 2-50 chars)
}
```

#### Event Details
```javascript
eventDetails: {
    eventType: String (Wedding, Birthday Party, Corporate Event, etc.),
    eventDate: Date (required, future date),
    guestCount: Number (1-10,000),
    budget: Number (₹1,000 - ₹1,00,00,000),
    location: String (required, 5-200 chars),
    specialRequirements: String (max 1000 chars)
}
```

#### Vendor Assignment
- `selectedVendorId` (Number): Client's preferred vendor
- `assignedVendorId` (Number): Admin's final assignment
- `status`: pending, assigned, in_progress, completed, cancelled
- `adminNotes` (String): Assignment notes
- `assignedAt` (Date): Assignment timestamp
- `completedAt` (Date): Completion timestamp

#### **NEW: Enhanced Tracking Fields**
```javascript
// Assignment history tracking
assignmentHistory: {
    totalReassignments: Number,
    previousVendorIds: Array,
    assignmentNotes: Array
}

// Communication tracking
communicationLog: {
    vendorFirstContact: Date,
    vendorResponseTime: Number (hours),
    lastClientContact: Date,
    totalCommunications: Number
}

// Progress tracking
progressTracking: {
    milestones: [{
        name: String,
        status: String (pending, in_progress, completed, skipped),
        dueDate: Date,
        completedDate: Date,
        notes: String
    }],
    overallProgress: Number (0-100),
    lastProgressUpdate: Date
}

// Quality assurance
qualityAssurance: {
    adminReviewRequired: Boolean,
    adminReviewDate: Date,
    adminReviewNotes: String,
    qualityScore: Number (0-10)
}

// Financial tracking
financialDetails: {
    quotedAmount: Number,
    finalAmount: Number,
    advanceAmount: Number,
    paymentStatus: String (pending, advance_paid, partially_paid, fully_paid, refunded),
    paymentDueDate: Date
}
```

#### Client Preferences
```javascript
preferences: {
    preferredContactTime: String (morning, afternoon, evening, anytime),
    urgency: String (low, medium, high),
    communicationMethod: String (email, phone, whatsapp),
    followUpFrequency: String (daily, weekly, bi-weekly, monthly, as-needed),
    preferredMeetingType: String (in-person, video-call, phone-call, email-only)
}
```

#### Virtual Properties and Methods
- `ageInDays`: Request age calculation
- `daysUntilEvent`: Days until event date
- `isUrgent()`: Urgency check
- `addAssignmentHistory()`: Track vendor changes
- `logCommunication()`: Log client/vendor communication
- `updateProgress()`: Update milestone progress
- `updateFinancials()`: Update payment details

---

### 3. **NotificationLog** - Email Notification Tracking
**File:** `src/models/notificationLog.js`

#### Notification Identification
- `notificationId` (Number, unique): Auto-generated notification ID
- `requestId` (Number): Reference to VendorRequest
- `notificationType`: client_assignment, vendor_assignment, status_update, reminder, cancellation

#### Recipient Information
```javascript
recipient: {
    email: String (required, valid email),
    name: String (required),
    type: String (client, vendor, admin),
    userId: Number (optional)
}
```

#### Email Details
```javascript
emailDetails: {
    subject: String (required, max 200 chars),
    templateUsed: String (required),
    messageId: String (set after sending),
    priority: String (low, normal, high, urgent)
}
```

#### Delivery Status Tracking
```javascript
deliveryStatus: {
    status: String (pending, sent, delivered, failed, bounced, rejected),
    sentAt: Date,
    deliveredAt: Date,
    failureReason: String,
    retryCount: Number (0-5),
    nextRetryAt: Date
}
```

#### Context and Analytics
```javascript
contextData: {
    assignedVendorId: Number,
    eventType: String,
    eventDate: Date,
    urgencyLevel: String,
    adminId: ObjectId
}

tracking: {
    opened: Boolean,
    openedAt: Date,
    clicked: Boolean,
    clickedAt: Date,
    userAgent: String,
    ipAddress: String
}
```

#### Methods
- `markAsSent()`: Update sent status
- `markAsFailed()`: Handle delivery failures
- `markAsDelivered()`: Confirm delivery
- `trackOpen()`: Track email opens
- `trackClick()`: Track email clicks
- `getDeliveryStats()`: Delivery statistics

---

### 4. **AssignmentHistory** - Audit Trail
**File:** `src/models/assignmentHistory.js`

#### History Identification
- `historyId` (Number, unique): Auto-generated history ID
- `requestId` (Number): Reference to VendorRequest
- `action`: request_created, vendor_assigned, vendor_reassigned, status_updated, etc.

#### Actor Information
```javascript
actor: {
    type: String (admin, vendor, client, system),
    userId: ObjectId,
    email: String,
    name: String
}
```

#### Assignment Details
```javascript
assignmentDetails: {
    previousVendorId: Number,
    newVendorId: Number,
    previousStatus: String,
    newStatus: String,
    wasOverride: Boolean,
    originalSelectedVendorId: Number
}
```

#### Context and Metadata
```javascript
contextData: {
    clientInfo: Object,
    eventDetails: Object,
    vendorInfo: Object
}

metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    requestSource: String,
    environment: String
}

timing: {
    actionTimestamp: Date,
    processingTimeMs: Number,
    responseTime: Number
}
```

#### Impact Tracking
```javascript
impact: {
    notificationsSent: Number,
    affectedUsers: Array,
    systemChanges: Array
}
```

#### Methods
- `createEntry()`: Create new history entry
- `getRequestTimeline()`: Get complete request timeline
- `getAdminActivityReport()`: Admin activity analytics
- `getVendorAssignmentStats()`: Vendor assignment statistics

---

### 5. **ClientFeedback** - Vendor Rating System
**File:** `src/models/clientFeedback.js`

#### Feedback Identification
- `feedbackId` (Number, unique): Auto-generated feedback ID
- `requestId` (Number, unique): Reference to completed VendorRequest

#### Client and Vendor Information
```javascript
clientInfo: {
    name: String (required),
    email: String (required),
    phone: String (required)
}

vendorInfo: {
    vendorId: Number (required),
    businessName: String (required),
    ownerName: String (required)
}
```

#### Event Context
```javascript
eventDetails: {
    eventType: String (required),
    eventDate: Date (required),
    guestCount: Number (required),
    location: String (required)
}
```

#### Rating System
```javascript
overallRating: Number (1-5, required)

detailedRatings: {
    communication: Number (1-5),
    professionalism: Number (1-5),
    quality: Number (1-5),
    timeliness: Number (1-5),
    valueForMoney: Number (1-5)
}
```

#### Written Feedback
```javascript
feedback: {
    positives: String (max 1000 chars),
    improvements: String (max 1000 chars),
    overallComment: String (required, 10-2000 chars)
}

recommendation: {
    wouldRecommend: Boolean (required),
    recommendationReason: String (max 500 chars),
    likelyToUseAgain: Boolean (required)
}
```

#### Service-Specific Feedback
```javascript
serviceSpecificFeedback: {
    servicesUsed: Array (required),
    bestService: String,
    worstService: String,
    additionalServicesWanted: Array
}
```

#### Moderation and Display
```javascript
verification: {
    isVerified: Boolean,
    verifiedBy: ObjectId,
    verificationDate: Date,
    verificationNotes: String
}

displaySettings: {
    isPublic: Boolean,
    showClientName: Boolean,
    showEventDetails: Boolean,
    moderationStatus: String (pending, approved, rejected, flagged),
    moderatedBy: ObjectId,
    moderationDate: Date,
    moderationNotes: String
}
```

#### Methods
- `calculateSentimentScore()`: AI-based sentiment analysis
- `markAsVerified()`: Verify feedback authenticity
- `moderate()`: Moderate feedback for public display
- `getVendorRatingSummary()`: Vendor rating analytics
- `getRecentFeedback()`: Recent feedback display

---

### 6. **User** - Authentication System
**File:** `src/models/user.js`

#### User Authentication
- `role`: admin, vendor
- `email` (String, unique): Login email
- `password` (String, hashed): Encrypted password
- `last_login` (Date): Last login timestamp
- `is_active` (Boolean): Account status

#### Vendor Association
- `vendor_id` (ObjectId): Reference to VendorRegister
- `phone_number` (String): Contact number

#### Methods
- `comparePassword()`: Password verification
- Pre-save password hashing

---

### 7. **Client** - Client Information
**File:** `src/models/client.js`

#### Basic Information
- `clientId` (Number, unique): Auto-generated client ID
- `name` (String): Client name
- `email` (String, unique): Client email
- `phone` (String): 10-digit phone number

#### Event Requirements
- `eventType`: wedding, birthday, corporate, etc.
- `eventDate` (Date): Event date
- `guestCount` (Number): Number of guests
- `budget`: Min/max budget range
- `city` (String): Event city
- `venue` (String): Event venue
- `servicesRequired` (Array): Required services
- `specialRequirements` (String): Special needs

#### Status Tracking
- `status`: active, inactive, completed
- `isVerified` (Boolean): Verification status

---

## Database Indexes

### Performance Optimization Indexes

#### VendorRegister Indexes
```javascript
{ email: 1 } // Unique
{ userId: 1 } // Unique
{ status: 1, isActive: 1 }
{ status: 1, isPubliclyVisible: 1 }
{ city: 1, categories: 1 }
{ 'clientRating.averageRating': -1 }
{ displayPriority: -1 }
{ 'availability.status': 1 }
{ 'performanceMetrics.successRate': -1 }
{ createdAt: -1 }
```

#### VendorRequest Indexes
```javascript
{ requestId: 1 } // Unique
{ status: 1, createdAt: -1 }
{ assignedVendorId: 1, status: 1 }
{ 'clientInfo.email': 1 }
{ 'eventDetails.eventDate': 1 }
{ status: 1, 'eventDetails.eventDate': 1 } // Compound
{ assignedVendorId: 1, status: 1, 'eventDetails.eventDate': 1 } // Compound
{ 'clientInfo.name': 'text', 'eventDetails.location': 'text' } // Text search
```

#### NotificationLog Indexes
```javascript
{ notificationId: 1 } // Unique
{ requestId: 1 }
{ notificationType: 1, createdAt: -1 }
{ 'recipient.email': 1 }
{ 'deliveryStatus.status': 1 }
{ requestId: 1, notificationType: 1 } // Compound
```

#### AssignmentHistory Indexes
```javascript
{ historyId: 1 } // Unique
{ requestId: 1, 'timing.actionTimestamp': -1 }
{ action: 1, 'timing.actionTimestamp': -1 }
{ 'actor.type': 1, 'timing.actionTimestamp': -1 }
{ 'assignmentDetails.newVendorId': 1 }
```

#### ClientFeedback Indexes
```javascript
{ feedbackId: 1 } // Unique
{ requestId: 1 } // Unique
{ 'vendorInfo.vendorId': 1, createdAt: -1 }
{ overallRating: -1 }
{ 'displaySettings.moderationStatus': 1 }
{ 'vendorInfo.vendorId': 1, 'displaySettings.moderationStatus': 1 } // Compound
```

## Schema Relationships

### Entity Relationship Diagram
```
User (Admin/Vendor)
    ↓ (creates/manages)
VendorRegister
    ↓ (referenced by)
VendorRequest ←→ NotificationLog
    ↓ (tracked by)
AssignmentHistory
    ↓ (generates)
ClientFeedback
```

### Key Relationships
1. **User → VendorRegister**: One-to-one (vendor users)
2. **VendorRegister → VendorRequest**: One-to-many (vendor assignments)
3. **VendorRequest → NotificationLog**: One-to-many (notifications per request)
4. **VendorRequest → AssignmentHistory**: One-to-many (history tracking)
5. **VendorRequest → ClientFeedback**: One-to-one (feedback per completed request)

## Data Validation

### Input Validation Rules
- **Email**: Valid email format, unique constraints
- **Phone**: Exactly 10 digits, numeric only
- **Ratings**: 1-5 scale, required for feedback
- **Dates**: Future dates for events, proper date formats
- **Text Fields**: Length limits, required field validation
- **Enums**: Strict value validation for status fields

### Business Logic Validation
- **Event Date**: Must be in the future
- **Budget**: Minimum ₹1,000, maximum ₹1,00,00,000
- **Guest Count**: Minimum 1, maximum 10,000
- **Vendor Assignment**: Only approved vendors can be assigned
- **Status Transitions**: Proper status flow validation

## Performance Considerations

### Query Optimization
- **Compound Indexes**: For multi-field queries
- **Text Indexes**: For search functionality
- **Sparse Indexes**: For optional fields
- **TTL Indexes**: For temporary data cleanup

### Data Archival
- **Soft Delete**: Using `isActive` flags
- **Historical Data**: Separate collections for old data
- **Log Rotation**: Automatic cleanup of old logs

### Scalability Features
- **Sharding Keys**: Prepared for horizontal scaling
- **Read Replicas**: Support for read-heavy operations
- **Caching Strategy**: Redis integration ready
- **Aggregation Pipelines**: Optimized for analytics

---

## Migration Strategy

### Schema Updates
1. **Backward Compatibility**: New fields with default values
2. **Data Migration Scripts**: For existing data transformation
3. **Index Creation**: Background index building
4. **Validation Updates**: Gradual validation rule enforcement

### Deployment Process
1. **Schema Validation**: Pre-deployment checks
2. **Index Building**: Background process during deployment
3. **Data Integrity**: Post-deployment verification
4. **Rollback Plan**: Schema rollback procedures

---

**Last Updated:** October 2024  
**Version:** 2.0.0  
**Status:** Production Ready ✅

This comprehensive schema supports the complete vendor-to-client assignment system with advanced features for performance tracking, notification management, and business analytics.
