const DemoRequest = require('../models/demoRequestSchema.js');
const nodemailer = require('nodemailer');

/**
 * Public endpoint — submit a demo/contact request
 */
const submitDemoRequest = async (req, res) => {
    try {
        const { schoolName, contactPerson, phone, email, message } = req.body;

        // Validation
        if (!schoolName || !contactPerson || !phone || !email) {
            return res.status(400).json({ 
                message: 'All required fields must be provided: schoolName, contactPerson, phone, email' 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Phone validation (10+ digits)
        const phoneClean = phone.replace(/\D/g, '');
        if (phoneClean.length < 10) {
            return res.status(400).json({ message: 'Please provide a valid phone number (minimum 10 digits)' });
        }

        // Store in MongoDB
        const demoRequest = new DemoRequest({
            schoolName: schoolName.trim(),
            contactPerson: contactPerson.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            message: message ? message.trim() : '',
        });

        const savedRequest = await demoRequest.save();

        // Optional: Send email notification to admin
        try {
            await sendEmailNotification(savedRequest);
        } catch (emailError) {
            // Don't fail the request if email fails — the data is already saved
            console.log('Email notification skipped (not configured or failed):', emailError.message);
        }

        res.status(201).json({
            message: 'Demo request submitted successfully! We will contact you shortly.',
            requestId: savedRequest._id,
        });
    } catch (err) {
        console.error('Demo request error:', err);
        res.status(500).json({ message: 'Failed to submit demo request. Please try again.' });
    }
};

/**
 * Send email notification to admin about new demo request
 * Only works if SMTP credentials are configured in .env
 */
const sendEmailNotification = async (demoData) => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;

    // Skip if email is not configured
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
        throw new Error('SMTP not configured');
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"OM SaaS Platform" <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `New Demo Request: ${demoData.schoolName}`,
        html: `
            <h2>New Demo Request Received</h2>
            <table style="border-collapse: collapse; width: 100%;">
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">School Name</td><td style="padding: 8px; border: 1px solid #ddd;">${demoData.schoolName}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Contact Person</td><td style="padding: 8px; border: 1px solid #ddd;">${demoData.contactPerson}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${demoData.phone}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${demoData.email}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${demoData.message || 'N/A'}</td></tr>
            </table>
            <p style="margin-top: 20px; color: #666;">Submitted at: ${new Date(demoData.createdAt).toLocaleString()}</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { submitDemoRequest };
