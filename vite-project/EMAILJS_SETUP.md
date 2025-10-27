# EmailJS Setup Guide

## Step 1: Install EmailJS Package

```bash
npm install @emailjs/browser
```

## Step 2: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 3: Add Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email
5. Copy the **Service ID** (e.g., `service_abc123`)

## Step 4: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Submission from {{from_name}}

From: {{from_name}}
Company: {{company_name}}
Email: {{from_email}}
Mobile: {{mobile_number}}

Message:
{{message}}
```

4. Save the template and copy the **Template ID** (e.g., `template_xyz789`)

## Step 5: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abc123XYZ`)

## Step 6: Update ContactForm.jsx

Replace these values in `src/components/ContactForm.jsx`:

```javascript
const EMAILJS_SERVICE_ID = 'service_abc123' // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789' // Your Template ID
const EMAILJS_PUBLIC_KEY = 'abc123XYZ' // Your Public Key
```

Also update the recipient email:

```javascript
to_email: 'your-email@example.com' // Your email address
```

## Step 7: Test the Form

1. Run `npm run dev`
2. Fill out the contact form
3. Verify mobile with OTP
4. Submit the form
5. Check your email inbox

## Template Variables Available

- `{{from_name}}` - User's full name
- `{{company_name}}` - Company name (or "Not provided")
- `{{from_email}}` - User's email address
- `{{mobile_number}}` - Verified mobile number
- `{{message}}` - User's message (or "No message provided")
- `{{to_email}}` - Your email (recipient)

## Free Tier Limits

- 200 emails per month
- Perfect for small to medium contact forms

## Alternative: Nodemailer (Backend Required)

If you prefer Nodemailer, you'll need to:
1. Create a backend API (Node.js/Express)
2. Install nodemailer on the server
3. Create an API endpoint to send emails
4. Update the form to call your backend API

Let me know if you need help with the Nodemailer approach!
