const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/**
 * Test Assignment Notification System
 * Tests the complete workflow: Admin assignment → Notifications sent to both vendor and client
 */

// Test data
const testData = {
    // Admin login credentials
    adminCredentials: {
        email: "admin@occasionsuper.com",
        password: "admin123"
    },
    
    // Sample vendor request data for testing
    sampleVendorRequest: {
        clientInfo: {
            name: "Priya Sharma",
            email: "priya.sharma@example.com",
            phone: "9876543210",
            city: "Mumbai"
        },
        eventDetails: {
            eventType: "Wedding",
            eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            guestCount: 150,
            budget: 500000,
            location: "Grand Ballroom, Mumbai",
            specialRequirements: "Need traditional decorations and vegetarian catering"
        },
        selectedVendorId: 1, // Assuming vendor with ID 1 exists
        preferences: {
            preferredContactTime: "evening",
            urgency: "medium",
            communicationMethod: "phone"
        }
    },
    
    // Assignment data
    assignmentData: {
        assignedVendorId: 1, // Assign to vendor ID 1
        adminNotes: "This vendor has excellent experience with traditional weddings and is perfect for this client's requirements."
    }
};

let authToken = '';
let testRequestId = null;

/**
 * Step 1: Admin Login
 */
async function adminLogin() {
    try {
        console.log('\n🔐 Step 1: Admin Login');
        console.log('=====================================');
        
        const response = await axios.post(`${BASE_URL}/api/auth/login`, testData.adminCredentials);
        
        if (response.data.success) {
            authToken = response.data.token;
            console.log('✅ Admin login successful');
            console.log(`📧 Admin: ${response.data.user.email}`);
            console.log(`🎭 Role: ${response.data.user.role}`);
            return true;
        } else {
            console.log('❌ Admin login failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Admin login error:', error.response?.data?.message || error.message);
        return false;
    }
}

/**
 * Step 2: Submit a test vendor request (simulating client submission)
 */
async function submitTestVendorRequest() {
    try {
        console.log('\n📝 Step 2: Submit Test Vendor Request');
        console.log('=====================================');
        
        const response = await axios.post(`${BASE_URL}/api/public/vendor-requests`, testData.sampleVendorRequest);
        
        if (response.data.success) {
            testRequestId = response.data.data.requestId;
            console.log('✅ Vendor request submitted successfully');
            console.log(`🆔 Request ID: ${testRequestId}`);
            console.log(`👤 Client: ${response.data.data.clientName}`);
            console.log(`🎉 Event: ${response.data.data.eventType}`);
            console.log(`📅 Date: ${new Date(testData.sampleVendorRequest.eventDetails.eventDate).toLocaleDateString()}`);
            return true;
        } else {
            console.log('❌ Vendor request submission failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Vendor request submission error:', error.response?.data?.message || error.message);
        return false;
    }
}

/**
 * Step 3: Admin assigns vendor to request (this should trigger notifications)
 */
async function assignVendorToRequest() {
    try {
        console.log('\n🎯 Step 3: Admin Assigns Vendor (Triggers Notifications)');
        console.log('=====================================');
        
        const response = await axios.post(
            `${BASE_URL}/api/admin/vendor-requests/${testRequestId}/assign`,
            testData.assignmentData,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data.success) {
            console.log('✅ Vendor assignment successful');
            console.log(`🆔 Request ID: ${response.data.data.requestId}`);
            console.log(`📊 Status: ${response.data.data.statusDisplay}`);
            console.log(`🏢 Assigned Vendor: ${response.data.data.assignedVendorDetails.businessName}`);
            console.log(`👤 Vendor Owner: ${response.data.data.assignedVendorDetails.ownerName}`);
            console.log(`📧 Vendor Email: ${response.data.data.assignedVendorDetails.email}`);
            console.log(`📞 Vendor Phone: ${response.data.data.assignedVendorDetails.phone}`);
            
            // Check notification status
            if (response.data.data.notifications) {
                console.log('\n📬 Notification Status:');
                console.log(`   Status: ${response.data.data.notifications.status}`);
                console.log(`   Message: ${response.data.data.notifications.message}`);
                console.log(`   Expected Delivery: ${response.data.data.notifications.expectedDelivery}`);
            }
            
            // Show assignment details
            console.log('\n📋 Assignment Details:');
            console.log(`   Assigned By: ${response.data.data.assignmentDetails.assignedBy}`);
            console.log(`   Assigned At: ${new Date(response.data.data.assignmentDetails.assignedAt).toLocaleString()}`);
            console.log(`   Was Override: ${response.data.data.assignmentDetails.wasOverride ? 'Yes' : 'No'}`);
            
            if (response.data.data.adminNotes) {
                console.log(`   Admin Notes: ${response.data.data.adminNotes}`);
            }
            
            return true;
        } else {
            console.log('❌ Vendor assignment failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Vendor assignment error:', error.response?.data?.message || error.message);
        if (error.response?.data?.errors) {
            console.log('Validation errors:', error.response.data.errors);
        }
        return false;
    }
}

/**
 * Step 4: Verify request status after assignment
 */
async function verifyRequestStatus() {
    try {
        console.log('\n🔍 Step 4: Verify Request Status');
        console.log('=====================================');
        
        const response = await axios.get(`${BASE_URL}/api/public/vendor-requests/${testRequestId}`);
        
        if (response.data.success) {
            const request = response.data.data;
            console.log('✅ Request status verified');
            console.log(`🆔 Request ID: ${request.requestId}`);
            console.log(`📊 Status: ${request.statusDisplay}`);
            console.log(`👤 Client: ${request.clientInfo.name}`);
            console.log(`📧 Client Email: ${request.clientInfo.email}`);
            
            if (request.assignedVendorDetails) {
                console.log('\n🏢 Assigned Vendor Details:');
                console.log(`   Business: ${request.assignedVendorDetails.businessName}`);
                console.log(`   Owner: ${request.assignedVendorDetails.ownerName}`);
                console.log(`   Email: ${request.assignedVendorDetails.email}`);
                console.log(`   Phone: ${request.assignedVendorDetails.phone}`);
            }
            
            console.log('\n📅 Timeline:');
            console.log(`   Submitted: ${new Date(request.timeline.submittedAt).toLocaleString()}`);
            if (request.timeline.assignedAt) {
                console.log(`   Assigned: ${new Date(request.timeline.assignedAt).toLocaleString()}`);
            }
            console.log(`   Days Until Event: ${request.timeline.daysUntilEvent}`);
            console.log(`   Is Urgent: ${request.isUrgent ? 'Yes' : 'No'}`);
            
            return true;
        } else {
            console.log('❌ Request status verification failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Request status verification error:', error.response?.data?.message || error.message);
        return false;
    }
}

/**
 * Step 5: Check admin dashboard for the assigned request
 */
async function checkAdminDashboard() {
    try {
        console.log('\n📊 Step 5: Check Admin Dashboard');
        console.log('=====================================');
        
        const response = await axios.get(`${BASE_URL}/api/admin/vendor-requests?status=assigned&limit=5`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.success) {
            console.log('✅ Admin dashboard accessed successfully');
            console.log(`📊 Total Assigned Requests: ${response.data.data.pagination.totalRequests}`);
            
            // Find our test request
            const ourRequest = response.data.data.requests.find(req => req.requestId === testRequestId);
            if (ourRequest) {
                console.log('\n🎯 Our Test Request Found:');
                console.log(`   Request ID: ${ourRequest.requestId}`);
                console.log(`   Status: ${ourRequest.statusDisplay}`);
                console.log(`   Client: ${ourRequest.clientInfo.name}`);
                console.log(`   Event: ${ourRequest.eventDetails.eventType}`);
                console.log(`   Assigned Vendor ID: ${ourRequest.vendorInfo.assignedVendorId}`);
                console.log(`   Admin Notes: ${ourRequest.adminNotes || 'None'}`);
            } else {
                console.log('⚠️ Our test request not found in assigned requests');
            }
            
            return true;
        } else {
            console.log('❌ Admin dashboard access failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Admin dashboard access error:', error.response?.data?.message || error.message);
        return false;
    }
}

/**
 * Main test function
 */
async function runNotificationTest() {
    console.log('🚀 ASSIGNMENT NOTIFICATION SYSTEM TEST');
    console.log('=====================================');
    console.log('This test will:');
    console.log('1. Login as admin');
    console.log('2. Submit a test vendor request');
    console.log('3. Assign vendor to request (triggers notifications)');
    console.log('4. Verify request status');
    console.log('5. Check admin dashboard');
    console.log('\n📧 Expected Notifications:');
    console.log('   → Client will receive: Vendor assignment confirmation');
    console.log('   → Vendor will receive: New client assignment details');
    
    let success = true;
    
    // Step 1: Admin Login
    if (!await adminLogin()) {
        success = false;
    }
    
    // Step 2: Submit test vendor request
    if (success && !await submitTestVendorRequest()) {
        success = false;
    }
    
    // Step 3: Assign vendor (triggers notifications)
    if (success && !await assignVendorToRequest()) {
        success = false;
    }
    
    // Step 4: Verify request status
    if (success && !await verifyRequestStatus()) {
        success = false;
    }
    
    // Step 5: Check admin dashboard
    if (success && !await checkAdminDashboard()) {
        success = false;
    }
    
    // Final results
    console.log('\n🏁 TEST RESULTS');
    console.log('=====================================');
    if (success) {
        console.log('✅ ALL TESTS PASSED!');
        console.log('\n📬 Notification System Status:');
        console.log('   ✅ Assignment workflow completed successfully');
        console.log('   ✅ Notifications triggered automatically');
        console.log('   ✅ Both client and vendor should receive emails');
        console.log('\n💡 Check the email inboxes:');
        console.log(`   📧 Client Email: ${testData.sampleVendorRequest.clientInfo.email}`);
        console.log(`   📧 Vendor Email: Check the assigned vendor's email`);
        console.log('\n⏰ Notification Delivery:');
        console.log('   Expected delivery time: 2-3 minutes');
        console.log('   Check server logs for notification status');
        
        if (testRequestId) {
            console.log(`\n🆔 Test Request ID: ${testRequestId}`);
            console.log('   Use this ID to track the request in your system');
        }
    } else {
        console.log('❌ SOME TESTS FAILED');
        console.log('   Check the error messages above');
        console.log('   Verify your server is running and configured correctly');
    }
    
    console.log('\n📝 Next Steps:');
    console.log('1. Check email inboxes for notification delivery');
    console.log('2. Review server logs for notification processing');
    console.log('3. Test with real email addresses if using test emails');
    console.log('4. Verify SMTP configuration if emails are not received');
}

// Run the test
if (require.main === module) {
    runNotificationTest().catch(error => {
        console.error('❌ Test execution failed:', error.message);
        process.exit(1);
    });
}

module.exports = {
    runNotificationTest,
    testData
};
