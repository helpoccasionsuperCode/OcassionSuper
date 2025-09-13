const jwt = require("jsonwebtoken");
const User = require("../models/user");

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access token required" 
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET not configured");
            return res.status(500).json({ 
                success: false, 
                message: "Server configuration error" 
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, secret);
        
        // Find user to ensure they still exist and are active
        const user = await User.findById(decoded.sub);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        if (!user.is_active) {
            return res.status(403).json({ 
                success: false, 
                message: "Account is inactive" 
            });
        }

        // Attach user info to request object
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            vendor_id: user.vendor_id ? user.vendor_id.toString() : null,
            is_active: user.is_active
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token expired" 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Authentication failed" 
        });
    }
};

// Middleware to ensure user can only access their own profile
const authorizeProfileAccess = (req, res, next) => {
    try {
        const { userId } = req.params;
        const authenticatedUserId = req.user.id;

        // Check if user is trying to access their own profile
        if (userId !== authenticatedUserId) {
            // Allow admin users to access any profile
            if (req.user.role === 'admin') {
                return next();
            }
            
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. You can only access your own profile" 
            });
        }

        next();
    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Authorization failed" 
        });
    }
};

// Middleware to ensure only vendor role can access vendor endpoints
const requireVendorRole = (req, res, next) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Vendor role required" 
            });
        }
        next();
    } catch (error) {
        console.error("Role authorization error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Role authorization failed" 
        });
    }
};

module.exports = {
    authenticateToken,
    authorizeProfileAccess,
    requireVendorRole
};
