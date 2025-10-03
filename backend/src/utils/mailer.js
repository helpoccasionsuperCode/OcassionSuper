const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create a single transporter instance
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // Use true for port 465, false for all other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify the connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error("Error with SMTP configuration:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

module.exports = transporter;