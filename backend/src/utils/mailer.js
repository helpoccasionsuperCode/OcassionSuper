// // const nodemailer = require('nodemailer');
// // const dotenv = require('dotenv');

// // dotenv.config();

// // // Resolve env vars with sensible fallbacks and types
// // const resolvedHost = process.env.EMAIL_HOST || process.env.SMTP_HOST || '';
// // const resolvedPort = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
// // const resolvedUser = process.env.EMAIL_USER || process.env.SMTP_USER || '';
// // const resolvedPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || '';
// // const resolvedService = process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE || '';

// // console.log('Email configuration:', {
// //     host: resolvedHost,
// //     port: resolvedPort,
// //     user: resolvedUser,
// //     service: resolvedService,
// //     hasPassword: !!resolvedPass
// // });

// // // Determine secure: prefer explicit env, else infer from port
// // const envSecure = process.env.EMAIL_SECURE || process.env.SMTP_SECURE; 
// // const resolvedSecure = typeof envSecure !== 'undefined' ? String(envSecure) === 'true' : String(resolvedPort) === '465';

// // // TLS handling: allow self-signed in non-production unless explicitly overridden
// // let rejectUnauthorized = true;
// // if (process.env.EMAIL_TLS_REJECT_UNAUTHORIZED === 'false') {
// //     rejectUnauthorized = false;
// // } else if ((process.env.NODE_ENV || 'development') !== 'production' && !process.env.EMAIL_TLS_REJECT_UNAUTHORIZED) {
// //     // Default to allowing self-signed in dev if not explicitly set
// //     rejectUnauthorized = false;
// // }

// // let transporter;

// // try {
// //     if (resolvedService && !resolvedHost) {
// //         // Use well-known service if provided (e.g., 'gmail', 'sendgrid', etc.)
// //         transporter = nodemailer.createTransport({
// //             service: resolvedService,
// //             auth: { user: resolvedUser, pass: resolvedPass },
// //         });
// //     } else {
// //         // Direct host configuration
// //         transporter = nodemailer.createTransport({
// //             host: resolvedHost,
// //             port: resolvedPort,
// //             secure: resolvedSecure,
// //             auth: { user: resolvedUser, pass: resolvedPass },
// //             requireTLS: !resolvedSecure && resolvedPort === 587 ? true : undefined,
// //             tls: {
// //                 rejectUnauthorized,
// //             },
// //         });
// //     }
// // } catch (cfgErr) {
// //     console.error('Failed to configure SMTP transporter:', cfgErr);
// // }

// // if (transporter) {
// //     transporter.verify((error) => {
// //         if (error) console.log('SMTP connection failed:', error);
// //         else console.log('SMTP connection successful');
// //     });
// // }

// // module.exports = transporter;





// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

// dotenv.config();

// const isProduction = (process.env.NODE_ENV || 'development') === 'production';

// // Resolve configuration from env with flexibility
// const resolved = {
//   service: process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE || '',
//   host: process.env.SMTP_HOST || process.env.EMAIL_HOST || '',
//   port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 0),
//   user: process.env.SMTP_USER || process.env.EMAIL_USER || '',
//   pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
//   secureEnv: typeof process.env.SMTP_SECURE !== 'undefined' ? String(process.env.SMTP_SECURE) === 'true' : undefined,
// };

// // Infer secure based on port if not explicitly set
// const inferredSecure = resolved.secureEnv !== undefined
//   ? resolved.secureEnv
//   : String(resolved.port) === '465';

// // TLS policy: reject in prod by default, allow in dev unless overridden
// const envReject = process.env.SMTP_TLS_REJECT_UNAUTHORIZED;
// let rejectUnauthorized = isProduction;
// if (typeof envReject !== 'undefined') {
//   rejectUnauthorized = String(envReject) !== 'false';
// } else if (!isProduction) {
//   rejectUnauthorized = false;
// }

// let transporter;

// try {
//   if (resolved.service && !resolved.host) {
//     // Use a well-known service (e.g., gmail, sendgrid)
//     transporter = nodemailer.createTransport({
//       service: resolved.service,
//       auth: { user: resolved.user, pass: resolved.pass },
//       pool: true,
//       maxConnections: 3,
//       maxMessages: 50,
//       connectionTimeout: 15_000,
//       greetingTimeout: 10_000,
//       socketTimeout: 20_000,
//       tls: { rejectUnauthorized },
//       logger: !isProduction,
//     });
//   } else {
//     // Direct host/port configuration
//     transporter = nodemailer.createTransport({
//       host: resolved.host,
//       port: resolved.port || 587,
//       secure: inferredSecure,
//       auth: { user: resolved.user, pass: resolved.pass },
//       requireTLS: !inferredSecure,
//       pool: true,
//       maxConnections: 3,
//       maxMessages: 50,
//       connectionTimeout: 15_000,
//       greetingTimeout: 10_000,
//       socketTimeout: 20_000,
//       tls: { rejectUnauthorized },
//       logger: !isProduction,
//     });
//   }
// } catch (cfgErr) {
//   console.error('Failed to configure SMTP transporter:', cfgErr);
// }

// if (!transporter) {
//   // Create a stub that fails fast with a clear message instead of crashing the app
//   module.exports = {
//     sendMail: async () => {
//       throw new Error('Email not configured. Please set SMTP_SERVICE or SMTP_HOST/PORT/USER/PASS.');
//     },
//     verify: (cb) => cb && cb(new Error('Email not configured')),
//   };
// } else {
//   transporter.verify((error) => {
//     if (error) {
//       console.error('SMTP connection failed:', error && error.message ? error.message : error);
//     } else {
//       console.log('SMTP connection successful');
//     }
//   });
//   module.exports = transporter;
// }





const nodemailer = require('nodemailer');
console.log("Nodemailer version:", nodemailer.version);
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: EMAIL.SMTP_HOST,
            port: EMAIL.SMTP_PORT,
            auth: {
                user: EMAIL.SMTP_USER,
                pass: EMAIL.SMTP_PASS,
            },
        });
    }

    async sendEmail({ to, subject, text, html}){
        try{
            const info = await this.transporter.sendMail({
                from: EMAIL.SMTP_USER,
                to,
                subject,
                text,
                html,
            });

            console.log("Email sent:", info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}

module.exports = EmailService;