# Assignment Notification System

## Overview

The Assignment Notification System automatically sends email notifications to both clients and vendors when an admin assigns a vendor to a client request. This ensures immediate communication and smooth workflow coordination.

## Features

### ✅ **Automatic Notifications**
- **Client Notification**: Confirms vendor assignment with vendor contact details
- **Vendor Notification**: Provides client requirements and contact information
- **Asynchronous Processing**: Notifications don't block the assignment API response
- **Error Handling**: Robust error handling with detailed logging

### ✅ **Professional Email Templates**
- **Responsive Design**: Mobile-friendly HTML email templates
- **Branded Styling**: Consistent with OccasionSuper branding
- **Rich Content**: Includes all relevant assignment details
- **Urgency Indicators**: Visual priority indicators based on event timeline

### ✅ **Configuration Management**
- **Centralized Config**: All notification settings in one place
- **Environment-Aware**: Different settings for development/production
- **Customizable**: Easy to modify templates and settings

## Architecture

```
Admin Assignment Request
         ↓
Assignment Controller (admin.js)
         ↓
NotificationService.sendAssignmentNotifications()
         ↓
    ┌─────────────────────────────────┐
    ↓                                 ↓
Client Notification              Vendor Notification
    ↓                                 ↓
Email Template                   Email Template
    ↓                                 ↓
SMTP Delivery                    SMTP Delivery
```

## API Integration

### Assignment Endpoint
```
POST /api/admin/vendor-requests/:requestId/assign
```

**Request Body:**
```json
{
  "assignedVendorId": 123,
  "adminNotes": "Perfect match for this client's requirements"
}
```

**Response includes notification status:**
```json
{
  "success": true,
  "message": "Vendor assigned successfully",
  "data": {
    "requestId": 456,
    "status": "assigned",
    "notifications": {
      "status": "sent",
      "message": "Assignment notifications are being sent to both client and vendor",
      "expectedDelivery": "within 2-3 minutes"
    }
  }
}
```

## Email Templates

### Client Notification Email
**Subject:** `🎉 Vendor Assigned for Your {EventType} - Request #{RequestId}`

**Content Includes:**
- Assignment confirmation
- Event details summary
- Assigned vendor contact information
- Next steps and timeline
- Support contact information

### Vendor Notification Email
**Subject:** `🎯 New Client Assignment - {EventType} Request #{RequestId}`

**Content Includes:**
- Assignment notification
- Complete client contact details
- Detailed event requirements
- Urgency indicators
- Response timeline expectations
- Action steps for vendor

## Configuration

### Environment Variables Required
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Notification Settings
Located in `src/config/notifications.js`:

```javascript
const notificationConfig = {
  email: {
    senderName: "OccasionSuper Assignment Team",
    supportEmail: "support@occasionsuper.com",
    vendorSupportEmail: "vendor-support@occasionsuper.com"
  },
  timing: {
    expectedDeliveryTime: "2-3 minutes",
    vendorResponseTime: "24 hours",
    urgencyThresholds: {
      high: 7,    // 7 days or less = HIGH priority
      medium: 14, // 8-14 days = MEDIUM priority
      low: 15     // 15+ days = LOW priority
    }
  }
}
```

## Usage Examples

### 1. Basic Assignment with Notifications
```javascript
// Admin assigns vendor to request
const response = await axios.post('/api/admin/vendor-requests/123/assign', {
  assignedVendorId: 456,
  adminNotes: "Excellent match for this wedding"
});

// Notifications are automatically sent
// Check response.data.notifications for status
```

### 2. Manual Notification Sending
```javascript
const NotificationService = require('./src/services/notificationService');

const assignmentData = {
  clientInfo: { name: "John Doe", email: "john@example.com" },
  eventDetails: { eventType: "Wedding", eventDate: "2024-06-15" },
  assignedVendorDetails: { businessName: "Elite Events", email: "vendor@example.com" },
  requestId: 123,
  assignedAt: new Date(),
  adminNotes: "Perfect match!"
};

const results = await NotificationService.sendAssignmentNotifications(assignmentData);
```

## Testing

### Run Notification Tests
```bash
# Run the comprehensive notification test
node backend/test-assignment-notifications.js
```

**Test Coverage:**
- Admin login
- Vendor request submission
- Vendor assignment (triggers notifications)
- Request status verification
- Admin dashboard verification

### Test Results
The test will show:
- ✅ Assignment workflow completion
- 📧 Email delivery status
- 🔍 Request tracking information
- 📊 Admin dashboard updates

## Monitoring & Logging

### Success Logging
```javascript
logger.info('Assignment notifications completed', {
  requestId: 123,
  clientNotified: true,
  vendorNotified: true,
  errorCount: 0
});
```

### Error Logging
```javascript
logger.error('Assignment notifications failed', {
  requestId: 123,
  error: 'SMTP connection failed',
  clientNotified: false,
  vendorNotified: false
});
```

### Log Locations
- **Combined Logs**: `backend/logs/combined.log`
- **Error Logs**: `backend/logs/error.log`
- **HTTP Logs**: `backend/logs/http.log`

## Troubleshooting

### Common Issues

#### 1. Emails Not Sending
**Symptoms:** Notifications marked as sent but emails not received
**Solutions:**
- Check SMTP configuration in `.env`
- Verify Gmail app password (not regular password)
- Check spam/junk folders
- Review server logs for SMTP errors

#### 2. Template Rendering Issues
**Symptoms:** Broken email formatting
**Solutions:**
- Validate HTML in email templates
- Check for missing template variables
- Test with different email clients

#### 3. Notification Delays
**Symptoms:** Long delays in email delivery
**Solutions:**
- Check SMTP server status
- Review network connectivity
- Monitor server resource usage

### Debug Mode
Set environment variable for detailed logging:
```env
NODE_ENV=development
SEND_DEV_EMAILS=true
```

## Security Considerations

### Email Security
- Uses TLS encryption for SMTP
- Sensitive data only sent to authorized recipients
- No passwords or sensitive tokens in email content

### Data Privacy
- Client contact info only sent to assigned vendor
- Vendor details only sent to assigned client
- Admin oversight maintains data control

## Future Enhancements

### Planned Features
- [ ] SMS notifications for urgent assignments
- [ ] WhatsApp integration
- [ ] Email delivery tracking
- [ ] Notification preferences per user
- [ ] Template customization interface
- [ ] Multi-language support

### Performance Optimizations
- [ ] Email queue system for high volume
- [ ] Template caching
- [ ] Batch notification processing
- [ ] CDN integration for email assets

## Support

### Contact Information
- **Technical Support**: support@occasionsuper.com
- **Vendor Support**: vendor-support@occasionsuper.com
- **Phone**: +91 9870823328

### Documentation
- API Documentation: See `backend/readme.md`
- System Architecture: See project documentation
- Deployment Guide: See `VERCEL_DEPLOYMENT.md`

---

**Last Updated:** October 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
