import { useState } from 'react';
import { sendVendorCredentialsEmail, sendTestEmail, isEmailJSConfigured } from '../utils/emailService';
import { toast } from 'react-toastify';

/**
 * VendorEmailNotification Component
 * Handles sending email notifications to vendors with their login credentials
 */
const VendorEmailNotification = ({ 
  vendorData, 
  password, 
  onEmailSent, 
  onEmailFailed,
  showTestEmail = false 
}) => {
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  // Check if EmailJS is configured
  const isConfigured = isEmailJSConfigured();

  const handleSendEmail = async () => {
    if (!vendorData || !password) {
      toast.error('Vendor data and password are required');
      return;
    }

    if (!isConfigured) {
      toast.error('Email service is not configured. Please check environment variables.');
      return;
    }

    try {
      setSending(true);
      const success = await sendVendorCredentialsEmail(vendorData, password);
      
      if (success) {
        toast.success('Credentials email sent successfully!');
        onEmailSent && onEmailSent();
      } else {
        toast.error('Failed to send email. Please try again.');
        onEmailFailed && onEmailFailed();
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast.error('An error occurred while sending the email');
      onEmailFailed && onEmailFailed();
    } finally {
      setSending(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      toast.error('Please enter a test email address');
      return;
    }

    if (!isConfigured) {
      toast.error('Email service is not configured. Please check environment variables.');
      return;
    }

    try {
      setTesting(true);
      const success = await sendTestEmail(testEmail.trim());
      
      if (success) {
        toast.success('Test email sent successfully!');
        setTestEmail('');
      } else {
        toast.error('Failed to send test email. Please check configuration.');
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error('An error occurred while sending the test email');
    } finally {
      setTesting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-sm font-medium text-yellow-800">Email Service Not Configured</h3>
        </div>
        <p className="text-sm text-yellow-700 mb-3">
          EmailJS is not properly configured. Please set the following environment variables:
        </p>
        <ul className="text-xs text-yellow-600 space-y-1 mb-3">
          <li>• VITE_EMAILJS_SERVICE_ID</li>
          <li>• VITE_EMAILJS_TEMPLATE_ID</li>
          <li>• VITE_EMAILJS_PUBLIC_KEY</li>
        </ul>
        <p className="text-xs text-yellow-600">
          Contact your administrator to configure the email service.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center mb-3">
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <h3 className="text-sm font-medium text-gray-900">Send Login Credentials</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Send the generated login credentials to the vendor via email. The email will include:
      </p>
      
      <ul className="text-xs text-gray-500 space-y-1 mb-4">
        <li>• Login credentials (email and password)</li>
        <li>• Business information</li>
        <li>• Login URL</li>
        <li>• Support contact information</li>
      </ul>

      <div className="flex gap-2">
        <button
          onClick={handleSendEmail}
          disabled={sending || !vendorData || !password}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            sending || !vendorData || !password
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {sending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Email'
          )}
        </button>

        {showTestEmail && (
          <div className="flex gap-2 ml-auto">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Test email address"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-48"
            />
            <button
              onClick={handleTestEmail}
              disabled={testing || !testEmail.trim()}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                testing || !testEmail.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {testing ? 'Testing...' : 'Test'}
            </button>
          </div>
        )}
      </div>

      {vendorData && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Recipient:</strong> {vendorData.email} ({vendorData.businessName})
        </div>
      )}
    </div>
  );
};

export default VendorEmailNotification;
