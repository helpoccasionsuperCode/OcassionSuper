# Email Setup Instructions

## EmailJS Configuration

To enable email notifications for vendor credentials, you need to set up EmailJS:

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Create a free account
- Verify your email address

### 2. Create Email Service
- In your EmailJS dashboard, go to "Email Services"
- Click "Add New Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the setup instructions for your provider
- Note down the **Service ID**

### 3. Create Email Template
- Go to "Email Templates" in your dashboard
- Click "Create New Template"
- Use the following template variables in your email:

```html
Subject: Welcome to OccasionSuper - Your Vendor Account Credentials

<!-- Email Template HTML Structure -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to OccasionSuper</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header Section -->
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
        <!-- Logo placeholder - replace with your actual logo -->
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                <span style="color: white; font-weight: bold; font-size: 18px;">?</span>
            </div>
            <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-weight: bold; font-size: 18px;">?</span>
            </div>
            <h1 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: bold;">OccasionSuper</h1>
        </div>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">Your Event Planning Partner</p>
    </div>

    <!-- Welcome Message -->
    <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 15px;">Welcome, {{to_name}}!</h2>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 0;">
            Congratulations! Your vendor account has been successfully created and approved. 
            You can now access your vendor dashboard and start managing your business on OccasionSuper.
        </p>
    </div>

    <!-- Login Credentials Section -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #3b82f6; font-size: 18px; margin: 0 0 15px 0; display: flex; align-items: center;">
            <span style="background: #f59e0b; color: white; width: 20px; height: 20px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px;">🔒</span>
            Your Login Credentials
        </h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-weight: 500;">Email Address:</span>
            <span style="background: #e5e7eb; padding: 5px 10px; border-radius: 4px; font-family: monospace;">{{email}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 500;">Password:</span>
            <span style="background: #e5e7eb; padding: 5px 10px; border-radius: 4px; font-family: monospace;">{{password}}</span>
        </div>
    </div>

    <!-- Business Information Section -->
    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
        <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">🏢</span>
            Your Business Information
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <div><strong>BUSINESS NAME:</strong> {{business_name}}</div>
            <div><strong>CITY:</strong> {{city}}</div>
            <div><strong>CATEGORIES:</strong> {{categories}}</div>
            <div><strong>PHONE NUMBER:</strong> {{phone}}</div>
            <div><strong>SERVICE AREA:</strong> {{service_area}}</div>
        </div>
    </div>

    <!-- Access Dashboard Button -->
    <div style="text-align: center; margin-bottom: 30px;">
        <a href="{{dashboard_url}}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-flex; align-items: center; font-size: 16px;">
            <span style="margin-right: 10px;">🚀</span>
            Access Your Dashboard
        </a>
    </div>

    <!-- Need Help Section -->
    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #92400e; font-size: 18px; margin: 0 0 10px 0; display: flex; align-items: center;">
            <span style="margin-right: 10px;">💡</span>
            Need Help?
        </h3>
        <p style="color: #92400e; margin: 0; font-size: 14px;">
            If you have any questions or need assistance getting started, please don't hesitate to contact our support team at <strong>{{support_email}}</strong>. We're here to help you succeed!
        </p>
    </div>

    <!-- What's Next Section -->
    <div style="background: #dcfce7; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #15803d; font-size: 18px; margin: 0 0 15px 0; display: flex; align-items: center;">
            <span style="color: #15803d; margin-right: 10px;">❓❓</span>
            What's Next?
        </h3>
        <ul style="color: #15803d; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Log in to your dashboard using the credentials above</li>
            <li>Complete your business profile</li>
            <li>Upload your service packages and pricing</li>
            <li>Start receiving booking requests from customers</li>
        </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p style="margin: 0 0 5px 0;">This email was sent by <strong>{{company_name}}</strong></p>
        <p style="margin: 0 0 5px 0;">Please keep your login credentials secure and do not share them with others.</p>
        <p style="margin: 0;">If you didn't request this account, please contact us immediately at <strong>{{support_email}}</strong></p>
    </div>

</body>
</html>
```

### 4. Get Your Keys
- Note down the **Template ID** from your template
- Go to "Account" → "General" to find your **Public Key**

### 5. Configure Environment Variables
Create a `.env.local` file in the frontend directory with:

```env
# API Configuration
VITE_BACKEND_URL=https://ocassionsuper.onrender.com

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholder values with your actual EmailJS credentials.

### 6. Test the Setup
- Start your development server
- Go to the admin panel
- Create a vendor user
- Use the "Test" button in the email notification component to verify the setup

## Template Variables Reference

| Variable | Description |
|----------|-------------|
| `{{to_email}}` | Recipient email address |
| `{{to_name}}` | Recipient name (vendor owner) |
| `{{email}}` | Login email (same as to_email) |
| `{{password}}` | Generated password |
| `{{business_name}}` | Business name |
| `{{city}}` | City |
| `{{categories}}` | Business categories (comma-separated) |
| `{{phone}}` | Phone number |
| `{{service_area}}` | Service area |
| `{{login_url}}` | Vendor login URL |
| `{{dashboard_url}}` | Vendor dashboard URL |
| `{{support_email}}` | Support email address |
| `{{company_name}}` | Company name (OccasionSuper) |
| `{{current_year}}` | Current year (for footer) |
| `{{website_url}}` | Website URL |

## Troubleshooting

### Email Not Sending
1. Check that all environment variables are set correctly
2. Verify your EmailJS service is active
3. Check the browser console for error messages
4. Test with the test email feature

### Template Variables Not Working
1. Ensure variable names match exactly (case-sensitive)
2. Check that variables are wrapped in double curly braces: `{{variable_name}}`
3. Verify the template is saved and published

### CORS Issues
- EmailJS handles CORS automatically, but if you encounter issues, check your domain settings in EmailJS

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your EmailJS credentials secure
- Consider using different templates for different environments (dev/prod)
- Monitor your EmailJS usage to stay within free tier limits
