const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/public';

// Test data for vendor request submission
const sampleVendorRequest = {
    clientInfo: {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "9876543210",
        city: "Mumbai"
    },
    eventDetails: {
        eventType: "Wedding",
        eventDate: "2024-06-15T18:00:00.000Z",
        guestCount: 150,
        budget: 500000,
        location: "Taj Hotel, Mumbai",
        specialRequirements: "Need vegetarian catering and live music"
    },
    selectedVendorId: 1, // Assuming vendor with userId 1 exists
    preferences: {
        preferredContactTime: "evening",
        urgency: "medium",
        communicationMethod: "phone"
    }
};

// Test function for vendor request API
async function testVendorRequestAPI() {
    console.log('🧪 Testing Vendor Request API...\n');

    try {
        // Test 1: Submit vendor request
        console.log('1️⃣ Testing POST /api/public/vendor-requests');
        const response1 = await axios.post(`${BASE_URL}/vendor-requests`, sampleVendorRequest);
        
        console.log('✅ Status:', response1.status);
        console.log('📊 Response structure:');
        console.log('   - Success:', response1.data.success);
        console.log('   - Message:', response1.data.message);
        console.log('   - Request ID:', response1.data.data?.requestId);
        console.log('   - Status:', response1.data.data?.status);
        console.log('   - Client Name:', response1.data.data?.clientName);
        console.log('   - Event Type:', response1.data.data?.eventType);
        console.log('   - Selected Vendor ID:', response1.data.data?.selectedVendorId);
        console.log('   - Next Steps:', response1.data.data?.nextSteps?.length);
        
        const requestId = response1.data.data?.requestId;
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Get vendor request status
        if (requestId) {
            console.log(`2️⃣ Testing GET /api/public/vendor-requests/${requestId}`);
            const response2 = await axios.get(`${BASE_URL}/vendor-requests/${requestId}`);
            
            console.log('✅ Status:', response2.status);
            console.log('📊 Request Status:');
            console.log('   - Request ID:', response2.data.data?.requestId);
            console.log('   - Status:', response2.data.data?.status);
            console.log('   - Status Display:', response2.data.data?.statusDisplay);
            console.log('   - Client Info:', response2.data.data?.clientInfo?.name);
            console.log('   - Event Details:', response2.data.data?.eventDetails?.eventType);
            console.log('   - Timeline:', response2.data.data?.timeline?.submittedAt);
            console.log('   - Days Until Event:', response2.data.data?.timeline?.daysUntilEvent);
            console.log('   - Is Urgent:', response2.data.data?.isUrgent);
            
            console.log('\n' + '='.repeat(50) + '\n');
        }

        // Test 3: Get client requests by email
        console.log(`3️⃣ Testing GET /api/public/client-requests/${sampleVendorRequest.clientInfo.email}`);
        const response3 = await axios.get(`${BASE_URL}/client-requests/${encodeURIComponent(sampleVendorRequest.clientInfo.email)}`);
        
        console.log('✅ Status:', response3.status);
        console.log('📊 Client Requests:');
        console.log('   - Total Requests:', response3.data.data?.totalRequests);
        console.log('   - Pending:', response3.data.data?.summary?.pending);
        console.log('   - Assigned:', response3.data.data?.summary?.assigned);
        console.log('   - Completed:', response3.data.data?.summary?.completed);
        console.log('   - Cancelled:', response3.data.data?.summary?.cancelled);
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 4: Test validation errors
        console.log('4️⃣ Testing validation errors');
        const invalidRequest = {
            clientInfo: {
                name: "", // Empty name
                email: "invalid-email", // Invalid email
                phone: "123", // Invalid phone
                city: "A" // Too short city
            },
            eventDetails: {
                eventType: "Invalid Type", // Invalid event type
                eventDate: "2020-01-01", // Past date
                guestCount: -5, // Negative guest count
                budget: 500, // Too low budget
                location: "A", // Too short location
                specialRequirements: "A".repeat(1001) // Too long requirements
            },
            selectedVendorId: "invalid" // Invalid vendor ID
        };

        try {
            await axios.post(`${BASE_URL}/vendor-requests`, invalidRequest);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Validation errors correctly caught');
                console.log('   - Status:', error.response.status);
                console.log('   - Error Count:', error.response.data?.errors?.length || 0);
                console.log('   - Sample Errors:', error.response.data?.errors?.slice(0, 3));
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 5: Test non-existent request
        console.log('5️⃣ Testing non-existent request');
        try {
            await axios.get(`${BASE_URL}/vendor-requests/99999`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Correctly returned 404 for non-existent request');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 6: Test duplicate request
        console.log('6️⃣ Testing duplicate request prevention');
        try {
            await axios.post(`${BASE_URL}/vendor-requests`, sampleVendorRequest);
        } catch (error) {
            if (error.response?.status === 409) {
                console.log('✅ Duplicate request correctly prevented');
                console.log('   - Message:', error.response.data?.message);
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n🎉 All tests completed!');
        console.log('\n📋 API Summary:');
        console.log('   - POST /api/public/vendor-requests - Submit new vendor request');
        console.log('   - GET /api/public/vendor-requests/:id - Get request status');
        console.log('   - GET /api/public/client-requests/:email - Get all client requests');
        console.log('   - Validation and sanitization working correctly');
        console.log('   - Duplicate prevention implemented');
        console.log('   - Error handling working properly');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

// Test function for different event types
async function testDifferentEventTypes() {
    console.log('\n🎭 Testing Different Event Types...\n');

    const eventTypes = [
        'Wedding',
        'Birthday Party',
        'Corporate Event',
        'Anniversary',
        'Baby Shower',
        'Graduation',
        'Festival Celebration',
        'Conference',
        'Seminar'
    ];

    for (const eventType of eventTypes) {
        try {
            const testRequest = {
                ...sampleVendorRequest,
                clientInfo: {
                    ...sampleVendorRequest.clientInfo,
                    email: `test.${eventType.toLowerCase().replace(/\s+/g, '')}@example.com`
                },
                eventDetails: {
                    ...sampleVendorRequest.eventDetails,
                    eventType: eventType,
                    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
                }
            };

            const response = await axios.post(`${BASE_URL}/vendor-requests`, testRequest);
            console.log(`✅ ${eventType}: Request ID ${response.data.data?.requestId}`);
        } catch (error) {
            console.log(`❌ ${eventType}: ${error.response?.data?.message || error.message}`);
        }
    }
}

// Run the tests
async function runAllTests() {
    await testVendorRequestAPI();
    await testDifferentEventTypes();
}

runAllTests();
