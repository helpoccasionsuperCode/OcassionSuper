const vendorRegisterModel = require("../models/vendorRegister");
const logger = require("../utils/logger");

/**
 * Get all approved vendors for public browsing
 * Returns vendor information without sensitive data (names, contact info, documents)
 */
const getPublicVendors = async (req, res) => {
    try {
        console.log("Fetching public vendors...");
        
        // Extract query parameters for filtering
        const { 
            city, 
            category, 
            serviceArea, 
            limit = 20, 
            page = 1,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {
            status: "approved",
            isActive: true
        };

        // Add city filter if provided
        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        // Add category filter if provided
        if (category) {
            filter.categories = { $in: [new RegExp(category, 'i')] };
        }

        // Add service area filter if provided
        if (serviceArea) {
            filter.serviceArea = { $regex: serviceArea, $options: 'i' };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        console.log("Filter:", filter);
        console.log("Sort:", sort);

        // Query vendors with pagination
        const vendors = await vendorRegisterModel
            .find(filter)
            .select({
                // Include public-safe fields only
                userId: 1,
                city: 1,
                serviceArea: 1,
                categories: 1,
                othersCategories: 1,
                images: 1,
                videos: 1,
                packages: 1,
                createdAt: 1,
                profilePhoto: 1,
                clientRating: 1, // Use actual rating from the model
                responseTime: 1, // Use actual response time from the model
                verificationStatus: 1, // Needed for isVerified flag
                // Exclude sensitive fields
                businessName: 0,
                ownerName: 0,
                email: 0,
                phone: 0,
                socialMedia: 0,
                documents: 0,
                bankDetails: 0,
                verificationStatus: 0,
                upiId: 0
            })
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalVendors = await vendorRegisterModel.countDocuments(filter);
        const totalPages = Math.ceil(totalVendors / parseInt(limit));

        // Transform vendor data for public display
        const publicVendors = vendors.map(vendor => ({
            vendorId: vendor.userId,
            city: vendor.city,
            serviceArea: vendor.serviceArea,
            categories: vendor.categories,
            otherCategories: vendor.othersCategories,
            portfolio: {
                images: vendor.images || [],
                videos: vendor.videos || []
            },
            packages: vendor.packages || [],
            profilePhoto: vendor.profilePhoto || '',
            joinedDate: vendor.createdAt,
            rating: {
                averageRating: vendor.clientRating?.averageRating || 0,
                totalReviews: vendor.clientRating?.totalReviews || 0
            },
            responseTime: vendor.responseTime || 'N/A',
            isVerified: vendor.verificationStatus?.documentsVerified || false
        }));

        logger.info(`Public vendors fetched successfully`, {
            totalVendors: publicVendors.length,
            filters: { city, category, serviceArea },
            pagination: { page, limit, totalPages }
        });

        res.status(200).json({
            success: true,
            message: "Vendors fetched successfully",
            data: {
                vendors: publicVendors,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalVendors,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                },
                filters: {
                    applied: { city, category, serviceArea },
                    available: {
                        cities: await getAvailableCities(),
                        categories: await getAvailableCategories(),
                        serviceAreas: await getAvailableServiceAreas()
                    }
                }
            }
        });

    } catch (error) {
        console.error("getPublicVendors error:", error);
        
        logger.error("Failed to fetch public vendors", {
            error: error.message,
            stack: error.stack,
            query: req.query
        });

        res.status(500).json({
            success: false,
            message: "Failed to fetch vendors",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get specific vendor details for public viewing
 * Returns detailed vendor information without sensitive data
 */
const getPublicVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching public vendor details for ID: ${id}`);

        // Find vendor by userId (not MongoDB _id)
        const vendor = await vendorRegisterModel.findOne({
            userId: parseInt(id),
            status: "approved",
            isActive: true
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found or not available"
            });
        }

        // Transform vendor data for public display
        const publicVendor = {
            vendorId: vendor.userId,
            city: vendor.city,
            serviceArea: vendor.serviceArea,
            categories: vendor.categories,
            otherCategories: vendor.othersCategories,
            portfolio: {
                images: vendor.images || [],
                videos: vendor.videos || []
            },
            packages: vendor.packages || [],
            profilePhoto: vendor.profilePhoto || '',
            joinedDate: vendor.createdAt,
            rating: {
                averageRating: vendor.clientRating?.averageRating || 0,
                totalReviews: vendor.clientRating?.totalReviews || 0,
                reviews: [] // Placeholder for future implementation of fetching actual reviews
            },
            responseTime: vendor.responseTime || 'N/A',
            isVerified: vendor.verificationStatus?.documentsVerified || false,

            // Additional details for single vendor view
            about: {
                // TODO: Add vendor bio/description field to model
                description: "Professional event service provider with years of experience"
            },
            availability: {
                // TODO: Implement availability tracking
                status: "available",
                nextAvailableDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            }
        };

        logger.info(`Public vendor details fetched successfully`, {
            vendorId: vendor.userId,
            city: vendor.city,
            categories: vendor.categories
        });

        res.status(200).json({
            success: true,
            message: "Vendor details fetched successfully",
            data: publicVendor
        });

    } catch (error) {
        console.error("getPublicVendorById error:", error);
        
        logger.error("Failed to fetch public vendor details", {
            error: error.message,
            stack: error.stack,
            vendorId: req.params.id
        });

        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor details",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Helper function to get available cities
 */
const getAvailableCities = async () => {
    try {
        const cities = await vendorRegisterModel.distinct('city', {
            status: "approved",
            isActive: true
        });
        return cities.sort();
    } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
};

/**
 * Helper function to get available categories
 */
const getAvailableCategories = async () => {
    try {
        const categories = await vendorRegisterModel.distinct('categories', {
            status: "approved",
            isActive: true
        });
        // Flatten array of arrays and remove duplicates
        const flatCategories = [...new Set(categories.flat())];
        return flatCategories.sort();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

/**
 * Helper function to get available service areas
 */
const getAvailableServiceAreas = async () => {
    try {
        const serviceAreas = await vendorRegisterModel.distinct('serviceArea', {
            status: "approved",
            isActive: true
        });
        return serviceAreas.sort();
    } catch (error) {
        console.error("Error fetching service areas:", error);
        return [];
    }
};

module.exports = {
    getPublicVendors,
    getPublicVendorById
};
