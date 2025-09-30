// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

// dotenv.config();

// // Resolve env vars with sensible fallbacks and types
// const resolvedHost = process.env.EMAIL_HOST || process.env.SMTP_HOST || '';
// const resolvedPort = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
// const resolvedUser = process.env.EMAIL_USER || process.env.SMTP_USER || '';
// const resolvedPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || '';
// const resolvedService = process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE || '';

// console.log('Email configuration:', {
//     host: resolvedHost,
//     port: resolvedPort,
//     user: resolvedUser,
//     service: resolvedService,
//     hasPassword: !!resolvedPass
// });

// // Determine secure: prefer explicit env, else infer from port
// const envSecure = process.env.EMAIL_SECURE || process.env.SMTP_SECURE; 
// const resolvedSecure = typeof envSecure !== 'undefined' ? String(envSecure) === 'true' : String(resolvedPort) === '465';

// // TLS handling: allow self-signed in non-production unless explicitly overridden
// let rejectUnauthorized = true;
// if (process.env.EMAIL_TLS_REJECT_UNAUTHORIZED === 'false') {
//     rejectUnauthorized = false;
// } else if ((process.env.NODE_ENV || 'development') !== 'production' && !process.env.EMAIL_TLS_REJECT_UNAUTHORIZED) {
//     // Default to allowing self-signed in dev if not explicitly set
//     rejectUnauthorized = false;
// }

// let transporter;

// try {
//     if (resolvedService && !resolvedHost) {
//         // Use well-known service if provided (e.g., 'gmail', 'sendgrid', etc.)
//         transporter = nodemailer.createTransport({
//             service: resolvedService,
//             auth: { user: resolvedUser, pass: resolvedPass },
//         });
//     } else {
//         // Direct host configuration
//         transporter = nodemailer.createTransport({
//             host: resolvedHost,
//             port: resolvedPort,
//             secure: resolvedSecure,
//             auth: { user: resolvedUser, pass: resolvedPass },
//             requireTLS: !resolvedSecure && resolvedPort === 587 ? true : undefined,
//             tls: {
//                 rejectUnauthorized,
//             },
//         });
//     }
// } catch (cfgErr) {
//     console.error('Failed to configure SMTP transporter:', cfgErr);
// }

// if (transporter) {
//     transporter.verify((error) => {
//         if (error) console.log('SMTP connection failed:', error);
//         else console.log('SMTP connection successful');
//     });
// }

// module.exports = transporter;

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Always using Gmail, so we just read directly from .env
const resolvedHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const resolvedPort = Number(process.env.SMTP_PORT || 587);
const resolvedUser = process.env.SMTP_USER;
const resolvedPass = process.env.SMTP_PASS;

// ✅ Gmail always uses STARTTLS on port 587, so secure = false
const resolvedSecure = resolvedPort === 465; // only true if using SSL (rare for Gmail)

// Log the config (but never log password)
console.log('📧 Email configuration:', {
    host: resolvedHost,
    port: resolvedPort,
    user: resolvedUser,
    secure: resolvedSecure,
    hasPassword: !!resolvedPass
});

// ✅ Create transporter (Gmail setup)
let transporter;
try {
    transporter = nodemailer.createTransport({
        host: resolvedHost,
        port: resolvedPort,
        secure: resolvedSecure,
        auth: {
            user: resolvedUser,
            pass: resolvedPass,
        },
        requireTLS: true, // Gmail requires TLS
    });

    // Verify connection once during startup
    transporter.verify((error) => {
        if (error) {
            console.error('❌ SMTP connection failed:', error.message);
        } else {
            console.log('✅ SMTP connection successful');
        }
    });

} catch (cfgErr) {
    console.error('❌ Failed to configure SMTP transporter:', cfgErr.message);
}

module.exports = transporter;