const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
    return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
    login: async (req, res) => {
        try {
            let { email, password } = req.body || {};

            email = typeof email === "string" ? email.trim().toLowerCase() : email;
            password = typeof password === "string" ? password.trim() : password;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "email and password are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            if (!user.is_active) {
                return res.status(403).json({ success: false, message: "Account is inactive" });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            user.last_login = new Date();
            await user.save();

            const token = signToken({
                sub: user._id.toString(),
                role: user.role,
                vendor_id: user.vendor_id ? user.vendor_id.toString() : null,
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                        vendor_id: user.vendor_id,
                    },
                },
            });
        } catch (error) {
            console.error("login error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
};


