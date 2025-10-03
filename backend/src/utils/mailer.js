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

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("Missing SMTP environment variables");
}

// Infer secure based on port if not explicitly set
const inferredSecure = String(process.env.SMTP_PORT) === '465';

// Determine whether to reject self-signed certificates
// - In production: default to true (reject), unless explicitly disabled via env
// - In non-production: default to false (allow), unless explicitly enabled via env
const envReject = process.env.SMTP_TLS_REJECT_UNAUTHORIZED;
const isProduction = (process.env.NODE_ENV || 'development') === 'production';
let rejectUnauthorized = isProduction;
if (typeof envReject !== 'undefined') {
  rejectUnauthorized = String(envReject) !== 'false';
} else if (!isProduction) {
  rejectUnauthorized = false;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE ? String(process.env.SMTP_SECURE) === 'true' : inferredSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  tls: {
    // Allow self-signed certificates depending on env and config
    rejectUnauthorized,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection failed:', error.message);
  } else {
    console.log('SMTP connection successful');
  }
});

module.exports = transporter;

