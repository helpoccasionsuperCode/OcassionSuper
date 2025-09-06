# EmailJS Quick Start Guide

This guide will help you set up EmailJS for sending vendor credential emails in OccasionSuper.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. **Copy the Template ID** (you'll need this)
4. Use the HTML template from `EMAIL_SETUP.md` (it matches your design perfectly!)

### Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key**

### Step 5: Configure Environment Variables
Run the setup script:
```bash
cd occasionsuper/frontend
node setup-env.js
```

Or manually create `.env.local`:
```env
VITE_BACKEND_URL=https://ocassionsupernew-1.onrender.com
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 6: Test the Setup
1. Start your development server: `npm run dev`
2. Go to the admin panel
3. Create a vendor user
4. Use the "Test" button to send a test email

## 📧 Email Template Features

Your email template includes:
- ✅ OccasionSuper branding and logo
- ✅ Personalized welcome message
- ✅ Secure login credentials display
- ✅ Business information summary
- ✅ Dashboard access button
- ✅ Help and support section
- ✅ Step-by-step instructions
- ✅ Professional footer

## 🔧 Template Variables

The email service automatically populates these variables:
- `{{to_name}}` - Vendor owner name
- `{{email}}` - Login email
- `{{password}}` - Generated password
- `{{business_name}}` - Business name
- `{{city}}` - City
- `{{categories}}` - Business categories
- `{{phone}}` - Phone number
- `{{service_area}}` - Service area
- `{{dashboard_url}}` - Dashboard link
- `{{support_email}}` - Support contact

## 🐛 Troubleshooting

### Email Not Sending
1. Check environment variables are set correctly
2. Verify EmailJS service is active
3. Check browser console for errors
4. Test with the test email feature

### Template Variables Not Working
1. Ensure variable names match exactly (case-sensitive)
2. Check variables are wrapped in double curly braces: `{{variable_name}}`
3. Verify template is saved and published in EmailJS

### CORS Issues
- EmailJS handles CORS automatically
- If issues persist, check domain settings in EmailJS dashboard

## 📞 Support

If you need help:
1. Check the detailed `EMAIL_SETUP.md` file
2. Review EmailJS documentation
3. Contact support at support@occasionsuper.com

## 🎯 Next Steps

Once email is working:
1. Customize the email template design if needed
2. Set up different templates for different environments
3. Monitor email delivery rates
4. Consider upgrading EmailJS plan for higher limits
