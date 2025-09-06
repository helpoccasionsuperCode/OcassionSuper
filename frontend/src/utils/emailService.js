import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

/**
 * Send vendor credentials email using EmailJS
 * 
 * This function sends a professional email template that includes:
 * - OccasionSuper branding and logo
 * - Personalized welcome message
 * - Login credentials in a secure format
 * - Business information summary
 * - Dashboard access button
 * - Help and support information
 * - Step-by-step instructions
 * 
 * @param {Object} vendorData - Vendor information
 * @param {string} vendorData.email - Vendor email address
 * @param {string} vendorData.businessName - Business name
 * @param {string} vendorData.ownerName - Owner name
 * @param {string} vendorData.phone - Phone number
 * @param {string} vendorData.city - City
 * @param {string} vendorData.serviceArea - Service area
 * @param {string} vendorData.categories - Categories (array)
 * @param {string} password - Generated password
 * @returns {Promise<boolean>} - Success status
 */
export const sendVendorCredentialsEmail = async (vendorData, password) => {
  try {
    // Initialize EmailJS with public key
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Prepare template parameters to match the email template design
    const templateParams = {
      // Basic recipient information
      to_email: vendorData.email,
      to_name: vendorData.ownerName,
      
      // Login credentials section
      email: vendorData.email,
      password: password,
      
      // Business information section
      business_name: vendorData.businessName,
      city: vendorData.city,
      categories: Array.isArray(vendorData.categories) 
        ? vendorData.categories.join(', ') 
        : vendorData.categories || 'Not specified',
      phone: vendorData.phone || 'Not provided',
      service_area: vendorData.serviceArea,
      
      // Dashboard and support information
      login_url: `${window.location.origin}/vendor-auth`,
      dashboard_url: `${window.location.origin}/vendor-dashboard`,
      support_email: 'support@occasionsuper.com',
      company_name: 'OccasionSuper',
      
      // Additional template variables for styling
      current_year: new Date().getFullYear(),
      website_url: window.location.origin
    };

    // Send email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

/**
 * Send test email to verify EmailJS configuration
 * @param {string} testEmail - Email address to send test to
 * @returns {Promise<boolean>} - Success status
 */
export const sendTestEmail = async (testEmail) => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const templateParams = {
      // Basic recipient information
      to_email: testEmail,
      to_name: 'Test User',
      
      // Login credentials section
      email: testEmail,
      password: 'TestPassword123!',
      
      // Business information section
      business_name: 'Test Business',
      city: 'Test City',
      categories: 'Test Category',
      phone: '1234567890',
      service_area: 'Test Area',
      
      // Dashboard and support information
      login_url: `${window.location.origin}/vendor-auth`,
      dashboard_url: `${window.location.origin}/vendor-dashboard`,
      support_email: 'support@occasionsuper.com',
      company_name: 'OccasionSuper',
      
      // Additional template variables for styling
      current_year: new Date().getFullYear(),
      website_url: window.location.origin
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Test email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
};

/**
 * Check if EmailJS is properly configured
 * @returns {boolean} - Configuration status
 */
export const isEmailJSConfigured = () => {
  return !(
    EMAILJS_SERVICE_ID === 'your_service_id' ||
    EMAILJS_TEMPLATE_ID === 'your_template_id' ||
    EMAILJS_PUBLIC_KEY === 'your_public_key' ||
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY
  );
};
