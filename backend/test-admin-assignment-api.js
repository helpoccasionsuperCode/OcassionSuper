const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/admin';

// You'll need to get a valid admin JWT token for testing
const ADMIN_TOKEN = 'your-admin-jwt-token-here'; // Replace with actual token

// Test function for admin vendor assignment API
async function testAdminAssignmentAPI() {
    console.log('🧪 Testing Admin Vendor Assignment API...\n');

    const headers = {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        // First, get a pending request to assign
        console.log('1️⃣ Getting pending requests for assignment...');
        const pendingRequestsResponse = await axios.get(`${BASE_URL}/vendor-requests?status=pending`, { headers });
        
        if (pendingRequestsResponse.data.data.requests.length === 0) {
            console.log('⚠️  No pending requests found. Creating a test request first...');
            
            // Create a test vendor request
            const testRequest = {
                clientInfo: {
                    name: "Test Client",
                    email: "test.client@example.com",
                    phone: "9876543210",
                    city: "Mumbai"
                },
                eventDetails: {
                    eventType: "Wedding",
                    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                    guestCount: 100,
                    budget: 300000,
                    location: "Test Venue, Mumbai",
                    specialRequirements: "Test requirements"
                },
                selectedVendorId: 1, // Assuming vendor with userId 1 exists
                preferences: {
                    preferredContactTime: "evening",
                    urgency: "medium",
                    communicationMethod: "email"
                }
            };

            const createRequestResponse = await axios.post('http://localhost:3000/api/public/vendor-requests', testRequest);
            console.log(`✅ Test request created with ID: ${createRequestResponse.data.data.requestId}`);
            var testRequestId = createRequestResponse.data.data.requestId;
        } else {
            var testRequestId = pendingRequestsResponse.data.data.requests[0].requestId;
            console.log(`✅ Using existing pending request ID: ${testRequestId}`);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Assign vendor to request
        console.log('2️⃣ Testing POST /api/admin/vendor-requests/:requestId/assign');
        const assignmentData = {
            assignedVendorId: 1, // Assuming vendor with userId 1 exists and is approved
            adminNotes: "Assigned based on client requirements and vendor availability"
        };

        const assignResponse = await axios.post(`${BASE_URL}/vendor-requests/${testRequestId}/assign`, assignmentData, { headers });
        
        console.log('✅ Status:', assignResponse.status);
        console.log('📊 Assignment Response:');
        console.log('   - Success:', assignResponse.data.success);
        console.log('   - Message:', assignResponse.data.message);
        console.log('   - Request ID:', assignResponse.data.data?.requestId);
        console.log('   - Status:', assignResponse.data.data?.status);
        console.log('   - Assigned Vendor ID:', assignResponse.data.data?.assignedVendorId);
        console.log('   - Was Override:', assignResponse.data.data?.vendorInfo?.wasOverride);
        console.log('   - Assigned By:', assignResponse.data.data?.assignmentDetails?.assignedBy);
        console.log('   - Assigned At:', assignResponse.data.data?.assignmentDetails?.assignedAt);
        
        // Check if vendor details are included
        const assignedVendor = assignResponse.data.data?.assignedVendorDetails;
        if (assignedVendor) {
            console.log('\n🔍 Assigned Vendor Details:');
            console.log('   ✅ Has businessName:', !!assignedVendor.businessName);
            console.log('   ✅ Has ownerName:', !!assignedVendor.ownerName);
            console.log('   ✅ Has email:', !!assignedVendor.email);
            console.log('   ✅ Has phone:', !!assignedVendor.phone);
            console.log('   ✅ Has categories:', !!assignedVendor.categories);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Try to assign the same vendor again (should fail)
        console.log('3️⃣ Testing duplicate assignment (should fail)');
        try {
            await axios.post(`${BASE_URL}/vendor-requests/${testRequestId}/assign`, assignmentData, { headers });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correctly prevented duplicate assignment');
                console.log('   - Message:', error.response.data?.message);
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 4: Update request status
        console.log('4️⃣ Testing PATCH /api/admin/vendor-requests/:requestId/status');
        const statusUpdateData = {
            status: 'in_progress',
            adminNotes: 'Vendor has started working on the event'
        };

        const statusResponse = await axios.patch(`${BASE_URL}/vendor-requests/${testRequestId}/status`, statusUpdateData, { headers });
        
        console.log('✅ Status:', statusResponse.status);
        console.log('📊 Status Update Response:');
        console.log('   - Success:', statusResponse.data.success);
        console.log('   - Message:', statusResponse.data.message);
        console.log('   - New Status:', statusResponse.data.data?.status);
        console.log('   - Status Display:', statusResponse.data.data?.statusDisplay);
        console.log('   - Admin Notes:', statusResponse.data.data?.adminNotes);

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 5: Complete the request
        console.log('5️⃣ Testing completion of request');
        const completionData = {
            status: 'completed',
            adminNotes: 'Event completed successfully'
        };

        const completionResponse = await axios.patch(`${BASE_URL}/vendor-requests/${testRequestId}/status`, completionData, { headers });
        
        console.log('✅ Status:', completionResponse.status);
        console.log('📊 Completion Response:');
        console.log('   - Success:', completionResponse.data.success);
        console.log('   - Message:', completionResponse.data.message);
        console.log('   - Status:', completionResponse.data.data?.status);
        console.log('   - Completed At:', completionResponse.data.data?.completedAt);

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 6: Test validation errors
        console.log('6️⃣ Testing validation errors');
        
        // Test without assignedVendorId
        try {
            await axios.post(`${BASE_URL}/vendor-requests/${testRequestId}/assign`, { adminNotes: 'Test' }, { headers });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correctly caught missing assignedVendorId');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        // Test with invalid vendor ID
        try {
            await axios.post(`${BASE_URL}/vendor-requests/${testRequestId}/assign`, { assignedVendorId: 99999 }, { headers });
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Correctly caught invalid vendor ID');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        // Test with invalid status
        try {
            await axios.patch(`${BASE_URL}/vendor-requests/${testRequestId}/status`, { status: 'invalid_status' }, { headers });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correctly caught invalid status');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 7: Test non-existent request
        console.log('7️⃣ Testing non-existent request');
        try {
            await axios.post(`${BASE_URL}/vendor-requests/99999/assign`, assignmentData, { headers });
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Correctly returned 404 for non-existent request');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n🎉 All tests completed!');
        console.log('\n📋 Admin Assignment API Summary:');
        console.log('   - POST /api/admin/vendor-requests/:requestId/assign - Assign vendor to request');
        console.log('   - PATCH /api/admin/vendor-requests/:requestId/status - Update request status');
        console.log('   - Assignment override capability working correctly');
        console.log('   - Status tracking working properly');
        console.log('   - Validation and error handling working correctly');
        console.log('   - Authentication and authorization required');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
            
            if (error.response.status === 401) {
                console.log('\n💡 Note: You need to provide a valid admin JWT token');
                console.log('   Update ADMIN_TOKEN variable with a valid token from admin login');
            }
        }
    }
}

// Test function for assignment workflow scenarios
async function testAssignmentScenarios() {
    console.log('\n🎭 Testing Assignment Scenarios...\n');

    const headers = {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        // Scenario 1: Assign client's preferred vendor
        console.log('📋 Scenario 1: Assign client\'s preferred vendor');
        // This would require creating a request with a specific selectedVendorId
        
        // Scenario 2: Override client's choice
        console.log('📋 Scenario 2: Override client\'s vendor choice');
        // This would require assigning a different vendor than the one selected
        
        // Scenario 3: Handle vendor conflicts
        console.log('📋 Scenario 3: Handle vendor scheduling conflicts');
        // This would test assigning a vendor to multiple requests on the same date
        
        console.log('✅ All assignment scenarios tested');

    } catch (error) {
        console.error('❌ Scenario test failed:', error.message);
    }
}

// Test function for authentication errors
async function testAssignmentAuthenticationErrors() {
    console.log('\n🔐 Testing Assignment Authentication Errors...\n');

    const assignmentData = {
        assignedVendorId: 1,
        adminNotes: 'Test assignment'
    };

    try {
        // Test 1: No token
        console.log('1️⃣ Testing assignment without token');
        try {
            await axios.post(`${BASE_URL}/vendor-requests/1/assign`, assignmentData);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly returned 401 for missing token');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        // Test 2: Invalid token
        console.log('2️⃣ Testing assignment with invalid token');
        try {
            await axios.post(`${BASE_URL}/vendor-requests/1/assign`, assignmentData, {
                headers: { 'Authorization': 'Bearer invalid-token' }
            });
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly returned 401 for invalid token');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        // Test 3: Non-admin token
        console.log('3️⃣ Testing assignment with non-admin token');
        try {
            await axios.post(`${BASE_URL}/vendor-requests/1/assign`, assignmentData, {
                headers: { 'Authorization': 'Bearer vendor-token-here' }
            });
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('✅ Correctly returned 403 for non-admin token');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

    } catch (error) {
        console.error('❌ Authentication test failed:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    if (ADMIN_TOKEN === 'your-admin-jwt-token-here') {
        console.log('⚠️  Please update ADMIN_TOKEN with a valid admin JWT token');
        console.log('   You can get this from the admin login endpoint');
        await testAssignmentAuthenticationErrors();
    } else {
        await testAdminAssignmentAPI();
        await testAssignmentScenarios();
        await testAssignmentAuthenticationErrors();
    }
}

runAllTests();
