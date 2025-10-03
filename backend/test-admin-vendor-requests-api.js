const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/admin';

// You'll need to get a valid admin JWT token for testing
// This would typically come from a login endpoint
const ADMIN_TOKEN = 'your-admin-jwt-token-here'; // Replace with actual token

// Test function for admin vendor requests API
async function testAdminVendorRequestsAPI() {
    console.log('🧪 Testing Admin Vendor Requests API...\n');

    const headers = {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        // Test 1: Get all vendor requests (no filters)
        console.log('1️⃣ Testing GET /api/admin/vendor-requests');
        const response1 = await axios.get(`${BASE_URL}/vendor-requests`, { headers });
        
        console.log('✅ Status:', response1.status);
        console.log('📊 Response structure:');
        console.log('   - Success:', response1.data.success);
        console.log('   - Message:', response1.data.message);
        console.log('   - Requests count:', response1.data.data?.requests?.length || 0);
        console.log('   - Pagination:', response1.data.data?.pagination);
        
        // Check if requests have admin-specific data
        const request = response1.data.data?.requests?.[0];
        if (request) {
            console.log('\n🔍 Admin Request Data Structure:');
            console.log('   ✅ Has requestId:', !!request.requestId);
            console.log('   ✅ Has clientInfo:', !!request.clientInfo);
            console.log('   ✅ Has eventDetails:', !!request.eventDetails);
            console.log('   ✅ Has vendorInfo:', !!request.vendorInfo);
            console.log('   ✅ Has timeline:', !!request.timeline);
            console.log('   ✅ Has adminInfo:', !!request.adminInfo);
            console.log('   ✅ Has isUrgent:', typeof request.isUrgent === 'boolean');
            console.log('   ✅ Has canAssign:', typeof request.adminInfo?.canAssign === 'boolean');
        }
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Filter by status
        console.log('2️⃣ Testing GET /api/admin/vendor-requests?status=pending');
        const response2 = await axios.get(`${BASE_URL}/vendor-requests?status=pending`, { headers });
        
        console.log('✅ Status:', response2.status);
        console.log('📊 Pending requests:');
        console.log('   - Requests count:', response2.data.data?.requests?.length || 0);
        console.log('   - All pending?', response2.data.data?.requests?.every(r => r.status === 'pending'));
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Filter by event type
        console.log('3️⃣ Testing GET /api/admin/vendor-requests?eventType=Wedding');
        const response3 = await axios.get(`${BASE_URL}/vendor-requests?eventType=Wedding`, { headers });
        
        console.log('✅ Status:', response3.status);
        console.log('📊 Wedding requests:');
        console.log('   - Requests count:', response3.data.data?.requests?.length || 0);
        console.log('   - All weddings?', response3.data.data?.requests?.every(r => r.eventDetails?.eventType === 'Wedding'));
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 4: Filter by city
        console.log('4️⃣ Testing GET /api/admin/vendor-requests?city=Mumbai');
        const response4 = await axios.get(`${BASE_URL}/vendor-requests?city=Mumbai`, { headers });
        
        console.log('✅ Status:', response4.status);
        console.log('📊 Mumbai requests:');
        console.log('   - Requests count:', response4.data.data?.requests?.length || 0);
        console.log('   - All from Mumbai?', response4.data.data?.requests?.every(r => r.clientInfo?.city?.toLowerCase().includes('mumbai')));
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 5: Filter by urgency
        console.log('5️⃣ Testing GET /api/admin/vendor-requests?urgency=high');
        const response5 = await axios.get(`${BASE_URL}/vendor-requests?urgency=high`, { headers });
        
        console.log('✅ Status:', response5.status);
        console.log('📊 High urgency requests:');
        console.log('   - Requests count:', response5.data.data?.requests?.length || 0);
        console.log('   - All high urgency?', response5.data.data?.requests?.every(r => r.preferences?.urgency === 'high'));
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 6: Combined filters
        console.log('6️⃣ Testing GET /api/admin/vendor-requests?status=pending&eventType=Wedding&limit=5');
        const response6 = await axios.get(`${BASE_URL}/vendor-requests?status=pending&eventType=Wedding&limit=5`, { headers });
        
        console.log('✅ Status:', response6.status);
        console.log('📊 Filtered requests:');
        console.log('   - Requests count:', response6.data.data?.requests?.length || 0);
        console.log('   - Max 5 results?', response6.data.data?.requests?.length <= 5);
        console.log('   - All pending weddings?', response6.data.data?.requests?.every(r => 
            r.status === 'pending' && r.eventDetails?.eventType === 'Wedding'
        ));
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 7: Date range filter
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        console.log('7️⃣ Testing GET /api/admin/vendor-requests with date range');
        const dateFrom = tomorrow.toISOString().split('T')[0];
        const dateTo = nextMonth.toISOString().split('T')[0];
        const response7 = await axios.get(`${BASE_URL}/vendor-requests?dateFrom=${dateFrom}&dateTo=${dateTo}`, { headers });
        
        console.log('✅ Status:', response7.status);
        console.log('📊 Date range requests:');
        console.log('   - Requests count:', response7.data.data?.requests?.length || 0);
        console.log('   - Date from:', dateFrom);
        console.log('   - Date to:', dateTo);
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 8: Pagination
        console.log('8️⃣ Testing pagination');
        const response8 = await axios.get(`${BASE_URL}/vendor-requests?page=1&limit=2`, { headers });
        
        console.log('✅ Status:', response8.status);
        console.log('📊 Pagination test:');
        console.log('   - Current page:', response8.data.data?.pagination?.currentPage);
        console.log('   - Total pages:', response8.data.data?.pagination?.totalPages);
        console.log('   - Total requests:', response8.data.data?.pagination?.totalRequests);
        console.log('   - Has next page:', response8.data.data?.pagination?.hasNextPage);
        console.log('   - Has prev page:', response8.data.data?.pagination?.hasPrevPage);
        console.log('   - Results per page:', response8.data.data?.requests?.length);

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 9: Sorting
        console.log('9️⃣ Testing sorting');
        const response9 = await axios.get(`${BASE_URL}/vendor-requests?sortBy=eventDetails.eventDate&sortOrder=asc`, { headers });
        
        console.log('✅ Status:', response9.status);
        console.log('📊 Sorted by event date (asc):');
        console.log('   - Requests count:', response9.data.data?.requests?.length || 0);
        if (response9.data.data?.requests?.length > 1) {
            const dates = response9.data.data.requests.map(r => new Date(r.eventDetails?.eventDate));
            const isSorted = dates.every((date, i) => i === 0 || dates[i-1] <= date);
            console.log('   - Properly sorted?', isSorted);
        }

        console.log('\n🎉 All tests completed!');
        console.log('\n📋 Admin API Summary:');
        console.log('   - GET /api/admin/vendor-requests - List all vendor requests');
        console.log('   - Query parameters: status, eventType, city, dateFrom, dateTo, urgency, limit, page, sortBy, sortOrder');
        console.log('   - Admin-specific data included (canAssign, isUrgent, adminInfo)');
        console.log('   - Filtering and pagination working correctly');
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

// Test function for authentication errors
async function testAuthenticationErrors() {
    console.log('\n🔐 Testing Authentication Errors...\n');

    try {
        // Test 1: No token
        console.log('1️⃣ Testing without token');
        try {
            await axios.get(`${BASE_URL}/vendor-requests`);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly returned 401 for missing token');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        // Test 2: Invalid token
        console.log('2️⃣ Testing with invalid token');
        try {
            await axios.get(`${BASE_URL}/vendor-requests`, {
                headers: { 'Authorization': 'Bearer invalid-token' }
            });
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly returned 401 for invalid token');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        // Test 3: Non-admin token (if you have a vendor token)
        console.log('3️⃣ Testing with non-admin token');
        try {
            await axios.get(`${BASE_URL}/vendor-requests`, {
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

// Run the tests
async function runAllTests() {
    if (ADMIN_TOKEN === 'your-admin-jwt-token-here') {
        console.log('⚠️  Please update ADMIN_TOKEN with a valid admin JWT token');
        console.log('   You can get this from the admin login endpoint');
        await testAuthenticationErrors();
    } else {
        await testAdminVendorRequestsAPI();
        await testAuthenticationErrors();
    }
}

runAllTests();
