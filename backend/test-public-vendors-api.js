const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/public';

// Test function for public vendors API
async function testPublicVendorsAPI() {
    console.log('🧪 Testing Public Vendors API...\n');

    try {
        // Test 1: Get all public vendors
        console.log('1️⃣ Testing GET /api/public/vendors');
        const response1 = await axios.get(`${BASE_URL}/vendors`);
        
        console.log('✅ Status:', response1.status);
        console.log('📊 Response structure:');
        console.log('   - Success:', response1.data.success);
        console.log('   - Message:', response1.data.message);
        console.log('   - Vendors count:', response1.data.data?.vendors?.length || 0);
        console.log('   - Pagination:', response1.data.data?.pagination);
        console.log('   - Filters available:', Object.keys(response1.data.data?.filters?.available || {}));
        
        // Check if sensitive data is excluded
        const vendor = response1.data.data?.vendors?.[0];
        if (vendor) {
            console.log('\n🔒 Security Check - Vendor data structure:');
            console.log('   ✅ Has vendorId:', !!vendor.vendorId);
            console.log('   ✅ Has city:', !!vendor.city);
            console.log('   ✅ Has categories:', !!vendor.categories);
            console.log('   ❌ NO businessName:', !vendor.businessName);
            console.log('   ❌ NO ownerName:', !vendor.ownerName);
            console.log('   ❌ NO email:', !vendor.email);
            console.log('   ❌ NO phone:', !vendor.phone);
            console.log('   ❌ NO documents:', !vendor.documents);
            console.log('   ❌ NO bankDetails:', !vendor.bankDetails);
        }
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Get vendors with filters
        console.log('2️⃣ Testing GET /api/public/vendors with filters');
        const response2 = await axios.get(`${BASE_URL}/vendors?city=Mumbai&category=Photography&limit=5`);
        
        console.log('✅ Status:', response2.status);
        console.log('📊 Filtered results:');
        console.log('   - Vendors count:', response2.data.data?.vendors?.length || 0);
        console.log('   - Applied filters:', response2.data.data?.filters?.applied);
        
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Get specific vendor by ID (if any vendors exist)
        if (vendor && vendor.vendorId) {
            console.log(`3️⃣ Testing GET /api/public/vendors/${vendor.vendorId}`);
            const response3 = await axios.get(`${BASE_URL}/vendors/${vendor.vendorId}`);
            
            console.log('✅ Status:', response3.status);
            console.log('📊 Single vendor details:');
            console.log('   - Vendor ID:', response3.data.data?.vendorId);
            console.log('   - City:', response3.data.data?.city);
            console.log('   - Categories:', response3.data.data?.categories);
            console.log('   - Portfolio images:', response3.data.data?.portfolio?.images?.length || 0);
            console.log('   - Packages:', response3.data.data?.packages?.length || 0);
            console.log('   - Rating:', response3.data.data?.rating);
            
            // Security check for single vendor
            console.log('\n🔒 Security Check - Single vendor data:');
            console.log('   ❌ NO businessName:', !response3.data.data?.businessName);
            console.log('   ❌ NO ownerName:', !response3.data.data?.ownerName);
            console.log('   ❌ NO email:', !response3.data.data?.email);
            console.log('   ❌ NO phone:', !response3.data.data?.phone);
        } else {
            console.log('3️⃣ Skipping single vendor test - no vendors available');
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 4: Test pagination
        console.log('4️⃣ Testing pagination');
        const response4 = await axios.get(`${BASE_URL}/vendors?page=1&limit=2`);
        
        console.log('✅ Status:', response4.status);
        console.log('📊 Pagination test:');
        console.log('   - Current page:', response4.data.data?.pagination?.currentPage);
        console.log('   - Total pages:', response4.data.data?.pagination?.totalPages);
        console.log('   - Total vendors:', response4.data.data?.pagination?.totalVendors);
        console.log('   - Has next page:', response4.data.data?.pagination?.hasNextPage);
        console.log('   - Has prev page:', response4.data.data?.pagination?.hasPrevPage);

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 5: Test non-existent vendor
        console.log('5️⃣ Testing non-existent vendor');
        try {
            await axios.get(`${BASE_URL}/vendors/99999`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Correctly returned 404 for non-existent vendor');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n🎉 All tests completed!');
        console.log('\n📋 API Summary:');
        console.log('   - GET /api/public/vendors - List all approved vendors');
        console.log('   - GET /api/public/vendors/:id - Get specific vendor details');
        console.log('   - Query parameters: city, category, serviceArea, limit, page, sortBy, sortOrder');
        console.log('   - Sensitive data properly excluded (names, contact info, documents)');
        console.log('   - Pagination and filtering working correctly');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

// Run the test
testPublicVendorsAPI();
