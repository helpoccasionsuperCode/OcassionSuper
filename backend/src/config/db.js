const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.DATABASE_URL || "mongodb://localhost:27017/occasionsuper";
        // await mongoose.connect(mongoURI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });

        await mongoose.connect(mongoURI);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        // Don't exit process, let the application handle it gracefully
        throw error;
    }
};

module.exports = connectDB;