const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const logger = require('../utils/logger');
const { createError } = require('../utils/errorHandler');
const NotificationLog = require('../models/notificationLog');

/**
 * Notification Service for Vendor Assignment System
 * Handles email notifications for vendors and clients
 * Creates a Nodemailer transport based on environment variables.
 * @returns {nodemailer.Transporter}
 */

const createTransport = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP environment variables not set. Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};


const transporter = createTransport();

/**
 * Renders an email template with the given data.
 * @param {string} templateName - The name of the EJS template file (e.g., 'clientAssignment').
 * @param {object} data - The data to pass to the template.
 * @returns {Promise<string>} The rendered HTML.
 */
const renderTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '..', 'views', 'emails', `${templateName}.ejs`);
    return await ejs.renderFile(templatePath, data);
  } catch (error) {
    logger.error(`Error rendering email template ${templateName}`, { error: error.message });
    throw createError(500, 'Failed to render email template.');
  }
};

/**
 * Sends an email.
 * @param {object} mailOptions - { to, subject, html, from }
 * @returns {Promise<void>}
 */

const sendEmail = async (mailOptions) => {
  if (!transporter) {
    logger.warn(`Skipping email to ${mailOptions.to} because SMTP is not configured.`);
    // In a real app, you might want to handle this differently,
    // but for now, we just log and resolve.
    return;
  }

  // Create a notification log entry
  const notificationLog = new NotificationLog({
    requestId: mailOptions.requestId,
    notificationType: mailOptions.notificationType,
    recipient: {
      email: mailOptions.to,
      name: mailOptions.recipientName,
      type: mailOptions.recipientType,
    },
    emailDetails: {
      subject: mailOptions.subject,
      templateUsed: mailOptions.templateName,
    },
    deliveryStatus: {
      status: 'pending',
    },
  });
  await notificationLog.save();

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || `"OccasionSuper" <${process.env.SMTP_USER}>`,
      ...mailOptions,
    });

    logger.info(`Email sent successfully to ${mailOptions.to}`, { messageId: info.messageId });

    // Update log to 'sent'
    notificationLog.deliveryStatus.status = 'sent';
    notificationLog.deliveryStatus.sentAt = new Date();
    notificationLog.emailDetails.messageId = info.messageId;
    await notificationLog.save();

  } catch (error) {
    logger.error(`Failed to send email to ${mailOptions.to}`, { error: error.message, subject: mailOptions.subject });
    // We don't throw here to prevent the main API flow from failing.
    // The error is logged for monitoring.

    // Update log to 'failed'
    notificationLog.deliveryStatus.status = 'failed';
    notificationLog.deliveryStatus.failureReason = error.message;
    notificationLog.deliveryStatus.retryCount = (notificationLog.deliveryStatus.retryCount || 0) + 1;
    await notificationLog.save();
  }
};

/**
 * Sends assignment notifications to both the client and the vendor.
 * This function is designed to be called asynchronously (fire-and-forget).
 * @param {object} assignmentData - Contains all necessary details for the notifications.
 * @param {object} assignmentData.clientInfo - { name, email }
 * @param {object} assignmentData.vendorInfo - { businessName, email }
 * @param {object} assignmentData.eventDetails - { eventType, eventDate, ... }
 * @param {number} assignmentData.requestId
 */
const sendAssignmentNotifications = async (assignmentData) => {
  const { clientInfo, vendorInfo, eventDetails, requestId } = assignmentData;

  if (!clientInfo || !vendorInfo || !eventDetails) {
    logger.error('Insufficient data for sending assignment notifications.', { requestId });
    return;
  }

  // 1. Prepare and send client notification
  try {
    const clientHtml = await renderTemplate('clientAssignmentNotification', {
      clientName: clientInfo.name,
      eventType: eventDetails.eventType,
      requestId,
      vendorName: vendorInfo.businessName,
      vendorContact: vendorInfo.email, // Or phone, as per requirements
      eventDetails,
    });

    sendEmail({
      to: clientInfo.email,
      recipientName: clientInfo.name,
      recipientType: 'client',
      requestId: requestId,
      notificationType: 'client_assignment',
      templateName: 'clientAssignmentNotification',
      subject: `🎉 Vendor Assigned for Your ${eventDetails.eventType} - Request #${requestId}`,
      html: clientHtml,
    });
  } catch (error) {
    logger.error('Error preparing client assignment notification', { requestId, error: error.message });
  }


  // 2. Prepare and send vendor notification
  try {
    const vendorHtml = await renderTemplate('vendorAssignmentNotification', {
      vendorName: vendorInfo.businessName,
      eventType: eventDetails.eventType,
      requestId,
      clientInfo,
      eventDetails,
    });

    sendEmail({
      to: vendorInfo.email,
      recipientName: vendorInfo.businessName,
      recipientType: 'vendor',
      requestId: requestId,
      notificationType: 'vendor_assignment',
      templateName: 'vendorAssignmentNotification',
      subject: `🎯 New Client Assignment - ${eventDetails.eventType} Request #${requestId}`,
      html: vendorHtml,
    });
  } catch (error) {
    logger.error('Error preparing vendor assignment notification', { requestId, error: error.message });
  }
};

module.exports = {
  sendAssignmentNotifications,
};
