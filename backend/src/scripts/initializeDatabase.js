const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models to ensure they're registered
const VendorRegisterModel = require('../models/vendorRegister');
const VendorRequestModel = require('../models/vendorRequest');
const NotificationLogModel = require('../models/notificationLog');
const AssignmentHistoryModel = require('../models/assignmentHistory');
const ClientFeedbackModel = require('../models/clientFeedback');
const UserModel = require('../models/user');
const ClientModel = require('../models/client');

/**
 * Database Initialization Script
 * Sets up indexes, validates schema, and prepares the database for production use
 */

async function connectToDatabase() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/occasionsuper';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB successfully');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return false;
    }
}

async function createIndexes() {
    console.log('\n📊 Creating database indexes...');
    
    try {
        // Create indexes for all models
        const models = [
            { name: 'VendorRegister', model: VendorRegisterModel },
            { name: 'VendorRequest', model: VendorRequestModel },
            { name: 'NotificationLog', model: NotificationLogModel },
            { name: 'AssignmentHistory', model: AssignmentHistoryModel },
            { name: 'ClientFeedback', model: ClientFeedbackModel },
            { name: 'User', model: UserModel },
            { name: 'Client', model: ClientModel }
        ];
        
        for (const { name, model } of models) {
            console.log(`  Creating indexes for ${name}...`);
            await model.createIndexes();
            console.log(`  ✅ ${name} indexes created`);
        }
        
        console.log('✅ All indexes created successfully');
        return true;
    } catch (error) {
        console.error('❌ Index creation failed:', error.message);
        return false;
    }
}

async function validateSchema() {
    console.log('\n🔍 Validating database schema...');
    
    try {
        // Test document creation and validation for each model
        const validationTests = [
            {
                name: 'VendorRegister',
                test: async () => {
                    const testVendor = new VendorRegisterModel({
                        businessName: 'Test Business',
                        ownerName: 'Test Owner',
                        email: 'test@gmail.com',
                        phone: '9876543210',
                        city: 'Test City',
                        serviceArea: 'Test Area',
                        categories: ['catering']
                    });
                    await testVendor.validate();
                    return true;
                }
            },
            {
                name: 'VendorRequest',
                test: async () => {
                    const testRequest = new VendorRequestModel({
                        clientInfo: {
                            name: 'Test Client',
                            email: 'client@example.com',
                            phone: '9876543210',
                            city: 'Test City'
                        },
                        eventDetails: {
                            eventType: 'Wedding',
                            eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            guestCount: 100,
                            budget: 50000,
                            location: 'Test Location'
                        },
                        selectedVendorId: 1
                    });
                    await testRequest.validate();
                    return true;
                }
            },
            {
                name: 'NotificationLog',
                test: async () => {
                    const testNotification = new NotificationLogModel({
                        requestId: 1,
                        notificationType: 'client_assignment',
                        recipient: {
                            email: 'test@example.com',
                            name: 'Test User',
                            type: 'client'
                        },
                        emailDetails: {
                            subject: 'Test Subject',
                            templateUsed: 'client_assignment'
                        }
                    });
                    await testNotification.validate();
                    return true;
                }
            },
            {
                name: 'AssignmentHistory',
                test: async () => {
                    const testHistory = new AssignmentHistoryModel({
                        requestId: 1,
                        action: 'vendor_assigned',
                        actor: {
                            type: 'admin',
                            email: 'admin@example.com',
                            name: 'Test Admin'
                        },
                        description: 'Test assignment'
                    });
                    await testHistory.validate();
                    return true;
                }
            },
            {
                name: 'ClientFeedback',
                test: async () => {
                    const testFeedback = new ClientFeedbackModel({
                        requestId: 1,
                        clientInfo: {
                            name: 'Test Client',
                            email: 'client@example.com',
                            phone: '9876543210'
                        },
                        vendorInfo: {
                            vendorId: 1,
                            businessName: 'Test Business',
                            ownerName: 'Test Owner'
                        },
                        eventDetails: {
                            eventType: 'Wedding',
                            eventDate: new Date(),
                            guestCount: 100,
                            location: 'Test Location'
                        },
                        overallRating: 5,
                        detailedRatings: {
                            communication: 5,
                            professionalism: 5,
                            quality: 5,
                            timeliness: 5,
                            valueForMoney: 5
                        },
                        feedback: {
                            overallComment: 'Excellent service provided by the vendor'
                        },
                        recommendation: {
                            wouldRecommend: true,
                            likelyToUseAgain: true
                        },
                        serviceSpecificFeedback: {
                            servicesUsed: ['catering']
                        }
                    });
                    await testFeedback.validate();
                    return true;
                }
            }
        ];
        
        for (const { name, test } of validationTests) {
            console.log(`  Validating ${name} schema...`);
            await test();
            console.log(`  ✅ ${name} schema valid`);
        }
        
        console.log('✅ All schemas validated successfully');
        return true;
    } catch (error) {
        console.error('❌ Schema validation failed:', error.message);
        return false;
    }
}

async function checkDatabaseHealth() {
    console.log('\n🏥 Checking database health...');
    
    try {
        // Check connection status
        const connectionState = mongoose.connection.readyState;
        const stateMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        console.log(`  Connection State: ${stateMap[connectionState]}`);
        
        // Check database stats
        const admin = mongoose.connection.db.admin();
        const stats = await mongoose.connection.db.stats();
        
        console.log(`  Database: ${mongoose.connection.name}`);
        console.log(`  Collections: ${stats.collections}`);
        console.log(`  Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`  Available Collections: ${collections.map(c => c.name).join(', ')}`);
        
        console.log('✅ Database health check completed');
        return true;
    } catch (error) {
        console.error('❌ Database health check failed:', error.message);
        return false;
    }
}

async function setupSampleData() {
    console.log('\n🌱 Setting up sample data (optional)...');
    
    try {
        // Check if we should create sample data
        const existingVendors = await VendorRegisterModel.countDocuments();
        
        if (existingVendors > 0) {
            console.log(`  Found ${existingVendors} existing vendors, skipping sample data creation`);
            return true;
        }
        
        console.log('  No existing data found, creating sample data...');
        
        // Create sample admin user
        const existingAdmin = await UserModel.findOne({ role: 'admin' });
        if (!existingAdmin) {
            const adminUser = new UserModel({
                role: 'admin',
                email: 'admin@occasionsuper.com',
                password: 'admin123', // Will be hashed by pre-save hook
                is_active: true
            });
            await adminUser.save();
            console.log('  ✅ Sample admin user created');
        }
        
        // Create sample vendor
        const sampleVendor = new VendorRegisterModel({
            businessName: 'Elite Events & Catering',
            ownerName: 'Rajesh Kumar',
            email: 'rajesh@gmail.com',
            phone: '9876543210',
            city: 'Mumbai',
            serviceArea: 'Mumbai Metropolitan Area',
            categories: ['catering', 'decoration', 'photography'],
            status: 'approved',
            businessProfile: {
                description: 'Premium event management and catering services with 10+ years of experience',
                yearsOfExperience: 10,
                teamSize: 25,
                specializations: ['Wedding Catering', 'Corporate Events', 'Birthday Parties']
            },
            clientRating: {
                averageRating: 4.5,
                totalReviews: 15,
                ratingBreakdown: {
                    fiveStars: 8,
                    fourStars: 5,
                    threeStars: 2,
                    twoStars: 0,
                    oneStar: 0
                }
            },
            performanceMetrics: {
                totalAssignments: 20,
                completedAssignments: 18,
                cancelledAssignments: 2,
                successRate: 90
            }
        });
        
        await sampleVendor.save();
        console.log('  ✅ Sample vendor created');
        
        // Create corresponding vendor user
        const vendorUser = new UserModel({
            role: 'vendor',
            email: 'rajesh@gmail.com',
            password: 'vendor123', // Will be hashed by pre-save hook
            vendor_id: sampleVendor._id,
            phone_number: '9876543210',
            is_active: true
        });
        await vendorUser.save();
        console.log('  ✅ Sample vendor user created');
        
        console.log('✅ Sample data setup completed');
        return true;
    } catch (error) {
        console.error('❌ Sample data setup failed:', error.message);
        return false;
    }
}

async function generateReport() {
    console.log('\n📋 Generating Database Setup Report...');
    
    try {
        const report = {
            timestamp: new Date().toISOString(),
            database: mongoose.connection.name,
            models: {},
            indexes: {},
            health: {}
        };
        
        // Count documents in each collection
        const models = [
            { name: 'vendors', model: VendorRegisterModel },
            { name: 'requests', model: VendorRequestModel },
            { name: 'notifications', model: NotificationLogModel },
            { name: 'history', model: AssignmentHistoryModel },
            { name: 'feedback', model: ClientFeedbackModel },
            { name: 'users', model: UserModel },
            { name: 'clients', model: ClientModel }
        ];
        
        for (const { name, model } of models) {
            const count = await model.countDocuments();
            const indexes = await model.collection.getIndexes();
            
            report.models[name] = { documentCount: count };
            report.indexes[name] = Object.keys(indexes).length;
        }
        
        // Database stats
        const stats = await mongoose.connection.db.stats();
        report.health = {
            connectionState: mongoose.connection.readyState,
            dataSize: Math.round(stats.dataSize / 1024 / 1024 * 100) / 100, // MB
            indexSize: Math.round(stats.indexSize / 1024 / 1024 * 100) / 100, // MB
            collections: stats.collections
        };
        
        console.log('\n📊 DATABASE SETUP REPORT');
        console.log('========================');
        console.log(`Timestamp: ${report.timestamp}`);
        console.log(`Database: ${report.database}`);
        console.log('\nDocument Counts:');
        Object.entries(report.models).forEach(([name, data]) => {
            console.log(`  ${name}: ${data.documentCount} documents`);
        });
        console.log('\nIndex Counts:');
        Object.entries(report.indexes).forEach(([name, count]) => {
            console.log(`  ${name}: ${count} indexes`);
        });
        console.log('\nDatabase Health:');
        console.log(`  Data Size: ${report.health.dataSize} MB`);
        console.log(`  Index Size: ${report.health.indexSize} MB`);
        console.log(`  Collections: ${report.health.collections}`);
        
        return report;
    } catch (error) {
        console.error('❌ Report generation failed:', error.message);
        return null;
    }
}

async function main() {
    console.log('🚀 OccasionSuper Database Initialization');
    console.log('========================================');
    
    let success = true;
    
    // Step 1: Connect to database
    if (!await connectToDatabase()) {
        success = false;
    }
    
    // Step 2: Create indexes
    if (success && !await createIndexes()) {
        success = false;
    }
    
    // Step 3: Validate schemas
    if (success && !await validateSchema()) {
        success = false;
    }
    
    // Step 4: Check database health
    if (success && !await checkDatabaseHealth()) {
        success = false;
    }
    
    // Step 5: Setup sample data (optional)
    if (success && process.argv.includes('--sample-data')) {
        if (!await setupSampleData()) {
            console.log('⚠️ Sample data setup failed, but continuing...');
        }
    }
    
    // Step 6: Generate report
    if (success) {
        await generateReport();
    }
    
    // Final status
    console.log('\n🏁 INITIALIZATION COMPLETE');
    console.log('==========================');
    if (success) {
        console.log('✅ Database initialization successful!');
        console.log('\n📝 Next Steps:');
        console.log('1. Start your application server');
        console.log('2. Test the API endpoints');
        console.log('3. Monitor the logs for any issues');
        console.log('4. Set up regular database backups');
    } else {
        console.log('❌ Database initialization failed!');
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check MongoDB connection string');
        console.log('2. Ensure MongoDB server is running');
        console.log('3. Verify database permissions');
        console.log('4. Check the error messages above');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    
    process.exit(success ? 0 : 1);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the initialization
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Initialization failed:', error.message);
        process.exit(1);
    });
}

module.exports = {
    connectToDatabase,
    createIndexes,
    validateSchema,
    checkDatabaseHealth,
    setupSampleData,
    generateReport
};
