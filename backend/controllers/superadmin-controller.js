const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const SuperAdmin = require('../models/superAdminSchema.js');
const Admin = require('../models/adminSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const DemoRequest = require('../models/demoRequestSchema.js');
const { generateToken } = require('../middleware/auth.js');

// ============================================================
// RAZORPAY INSTANCE
// ============================================================

const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay API Keys are missing in .env");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// ============================================================
// NODEMAILER — PAYMENT EMAIL
// ============================================================

/**
 * Send payment link email to client
 * Uses SMTP env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */
const sendPaymentEmail = async (demoRequest) => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        throw new Error('SMTP not configured — skipping email');
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
        to: demoRequest.email,
        subject: `Payment Link — ${demoRequest.schoolName} Onboarding`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f5f3ee; font-family: Georgia, 'Times New Roman', serif;">
    <div style="max-width:600px; margin:40px auto; background:#ffffff; border:1px solid #e0dcd0; box-shadow:4px 4px 0px #e0dcd0;">
        <!-- Header -->
        <div style="background:#1a1a1a; padding:30px 40px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:400; letter-spacing:2px; text-transform:uppercase;">
                OM SaaS Platform
            </h1>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
            <p style="color:#333; font-size:16px; line-height:1.6; margin:0 0 10px 0;">
                Dear <strong>${demoRequest.contactPerson}</strong>,
            </p>
            <p style="color:#555; font-size:15px; line-height:1.6; margin:0 0 25px 0;">
                Thank you for your interest in our School Management System. 
                We're excited to onboard <strong>${demoRequest.schoolName}</strong>!
            </p>

            <!-- Amount Box -->
            <div style="background:#fdfcf8; border:1px solid #e0dcd0; padding:20px; margin:0 0 25px 0; text-align:center;">
                <p style="color:#7d6b5d; font-size:13px; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px 0;">
                    Onboarding Amount
                </p>
                <p style="color:#1a1a1a; font-size:32px; font-weight:700; margin:0;">
                    ₹${demoRequest.amount.toLocaleString('en-IN')}
                </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center; margin:30px 0;">
                <a href="${demoRequest.paymentLink}" 
                   style="display:inline-block; background:#1a1a1a; color:#ffffff; padding:14px 40px; text-decoration:none; font-size:14px; letter-spacing:2px; text-transform:uppercase; font-family:Georgia, serif;">
                    Pay Now →
                </a>
            </div>

            <p style="color:#999; font-size:13px; line-height:1.5; margin:20px 0 0 0; text-align:center;">
                This payment link expires in <strong>24 hours</strong>.<br>
                If you face any issues, reply to this email.
            </p>
        </div>

        <!-- Footer -->
        <div style="background:#fdfcf8; border-top:1px solid #e0dcd0; padding:20px 40px; text-align:center;">
            <p style="color:#999; font-size:12px; margin:0;">
                © ${new Date().getFullYear()} OM SaaS Platform · School Management System
            </p>
        </div>
    </div>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✉ Payment email sent to ${demoRequest.email}`);
};

// ============================================================
// AUTH — SUPER ADMIN LOGIN
// ============================================================

/**
 * Super Admin Login — returns JWT token
 */
const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const superAdmin = await SuperAdmin.findOne({ email: email.toLowerCase() });
        if (!superAdmin) {
            return res.status(404).json({ message: 'Super Admin not found' });
        }

        const isValid = await bcrypt.compare(password, superAdmin.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken({
            id: superAdmin._id,
            role: superAdmin.role,
            email: superAdmin.email,
        });

        const adminData = superAdmin.toObject();
        delete adminData.password;

        res.json({ ...adminData, token });
    } catch (err) {
        console.error('SuperAdmin login error:', err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

// ============================================================
// SCHOOL MANAGEMENT
// ============================================================

/**
 * Generate unique school ID: SCH-YYYYMMDD-XXXX
 */
const generateSchoolId = () => {
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SCH-${dateStr}-${rand}`;
};

/**
 * Create a new school with admin account
 */
const createSchool = async (req, res) => {
    try {
        const {
            schoolName, email, phone, address,
            adminName, adminEmail, adminPassword,
            plan, board, medium
        } = req.body;

        // Validation
        if (!schoolName || !email || !adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({
                message: 'Required fields: schoolName, email, adminName, adminEmail, adminPassword'
            });
        }

        // Check for existing school
        const existingSchool = await Admin.findOne({
            $or: [
                { schoolName: schoolName },
                { email: adminEmail }
            ]
        });

        if (existingSchool) {
            if (existingSchool.schoolName === schoolName) {
                return res.status(409).json({ message: 'School name already exists' });
            }
            return res.status(409).json({ message: 'Admin email already exists' });
        }

        // Generate unique school ID
        let schoolId = generateSchoolId();
        // Ensure uniqueness
        while (await Admin.findOne({ schoolId })) {
            schoolId = generateSchoolId();
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin (school) record
        const newAdmin = new Admin({
            name: adminName.trim(),
            email: adminEmail.trim().toLowerCase(),
            password: hashedPassword,
            schoolName: schoolName.trim(),
            schoolId,
            isActive: true,
            plan: plan || 'free',
            mobile: phone || '',
            address: address || '',
            board: board || '',
            medium: medium || '',
            createdAt: new Date(),
        });

        const savedAdmin = await newAdmin.save();
        const adminData = savedAdmin.toObject();
        delete adminData.password;

        res.status(201).json({
            message: 'School created successfully',
            school: adminData,
            credentials: {
                schoolId,
                email: adminEmail,
                password: adminPassword, // Return plain password ONCE for admin to share
            }
        });
    } catch (err) {
        console.error('Create school error:', err);
        res.status(500).json({ message: 'Failed to create school', error: err.message });
    }
};

/**
 * Get all schools with student/teacher counts
 */
const getAllSchools = async (req, res) => {
    try {
        const schools = await Admin.find({}, '-password').sort({ createdAt: -1 });

        // Enrich with counts
        const enrichedSchools = await Promise.all(
            schools.map(async (school) => {
                const schoolObj = school.toObject();
                schoolObj.studentCount = await Student.countDocuments({ school: school._id });
                schoolObj.teacherCount = await Teacher.countDocuments({ school: school._id });
                return schoolObj;
            })
        );

        res.json(enrichedSchools);
    } catch (err) {
        console.error('Get schools error:', err);
        res.status(500).json({ message: 'Failed to fetch schools', error: err.message });
    }
};

/**
 * Toggle school active/inactive status
 */
const toggleSchoolStatus = async (req, res) => {
    try {
        const school = await Admin.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        school.isActive = !school.isActive;
        await school.save();

        res.json({
            message: `School ${school.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: school.isActive,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to toggle status', error: err.message });
    }
};

/**
 * Update school plan
 */
const updateSchoolPlan = async (req, res) => {
    try {
        const { plan } = req.body;
        const validPlans = ['free', 'foundation', 'professional', 'enterprise'];

        if (!plan || !validPlans.includes(plan)) {
            return res.status(400).json({ message: `Plan must be one of: ${validPlans.join(', ')}` });
        }

        const school = await Admin.findByIdAndUpdate(
            req.params.id,
            { plan },
            { new: true, select: '-password' }
        );

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.json({ message: 'Plan updated successfully', school });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update plan', error: err.message });
    }
};

/**
 * Update basic school info
 */
const updateSchoolInfo = async (req, res) => {
    try {
        const { schoolName, email, phone, address, board, medium } = req.body;

        const updateData = {};
        if (schoolName) updateData.schoolName = schoolName.trim();
        if (email) updateData.email = email.trim().toLowerCase();
        if (phone) updateData.mobile = phone.trim();
        if (address) updateData.address = address.trim();
        if (board) updateData.board = board.trim();
        if (medium) updateData.medium = medium.trim();

        const school = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, select: '-password' }
        );

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.json({ message: 'School info updated', school });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update school info', error: err.message });
    }
};

// ============================================================
// DEMO REQUESTS
// ============================================================

/**
 * Get all demo requests
 */
const getDemoRequests = async (req, res) => {
    try {
        const requests = await DemoRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch demo requests', error: err.message });
    }
};

/**
 * Update demo request status
 * When status = "payment_pending":
 *   - Creates a Razorpay Payment Link (with 24h expiry)
 *   - Sends payment email to client via Nodemailer
 *   - Saves payment link, amount, and linkId to the document
 * 
 * Safeguards:
 *   - Idempotency: blocks duplicate payment link creation
 *   - No Razorpay notifications (only our email is sent)
 *   - Amount is locked before link creation
 */
const updateDemoRequestStatus = async (req, res) => {
    try {
        const { status, amount: requestedAmount } = req.body;
        const validStatuses = ['pending', 'contacted', 'interested', 'payment_pending', 'paid', 'onboarded', 'rejected'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const demoRequest = await DemoRequest.findById(req.params.id);
        if (!demoRequest) {
            return res.status(404).json({ message: 'Demo request not found' });
        }

        // ── Handle payment_pending: create Razorpay Payment Link ──
        if (status === 'payment_pending') {
            // Idempotency check — prevent duplicate payment links
            if (demoRequest.paymentLink) {
                return res.status(400).json({
                    message: 'Payment link already exists for this request',
                    paymentLink: demoRequest.paymentLink,
                });
            }

            const amount = Number(requestedAmount) || Number(process.env.ONBOARDING_AMOUNT) || 1000;

            // Lock amount before creating link
            demoRequest.amount = amount;

            try {
                const razorpay = getRazorpayInstance();

                const paymentLink = await razorpay.paymentLink.create({
                    amount: amount * 100, // Convert to paise
                    currency: "INR",
                    description: `Onboarding payment for ${demoRequest.schoolName}`,
                    customer: {
                        name: demoRequest.contactPerson,
                        email: demoRequest.email,
                        contact: demoRequest.phone,
                    },
                    notify: { sms: false, email: false }, // We handle communication — no Razorpay emails
                    callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success`,
                    callback_method: "get",
                    expire_by: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24-hour expiry
                });

                console.log(`🔗 Payment link created: ${paymentLink.id} → ${paymentLink.short_url}`);

                // Update document with payment data
                demoRequest.status = 'payment_pending';
                demoRequest.paymentLink = paymentLink.short_url;
                demoRequest.paymentLinkId = paymentLink.id;
                await demoRequest.save();

                // Send email to client (non-blocking — don't fail if email fails)
                try {
                    await sendPaymentEmail(demoRequest);
                } catch (emailError) {
                    console.log('⚠ Payment email skipped (SMTP not configured):', emailError.message);
                }

                return res.json({
                    message: 'Payment link created and sent',
                    request: demoRequest,
                });
            } catch (razorpayError) {
                console.error('❌ Razorpay payment link creation failed:', razorpayError);
                return res.status(500).json({
                    message: 'Failed to create payment link',
                    error: razorpayError.message,
                });
            }
        }

        // ── Handle all other status updates (simple update) ──
        demoRequest.status = status;
        await demoRequest.save();

        res.json({ message: 'Status updated', request: demoRequest });
    } catch (err) {
        console.error('Update demo request status error:', err);
        res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
};

// ============================================================
// RAZORPAY WEBHOOK — payment_link.paid
// ============================================================

/**
 * Razorpay Webhook Handler
 * 
 * Listens for `payment_link.paid` events.
 * Verifies signature using raw body + RAZORPAY_WEBHOOK_SECRET.
 * Updates demo request: paymentStatus → "paid", status → "paid", paidAt.
 * 
 * Safeguards:
 *   - Signature verification (prevents spoofing)
 *   - Idempotency (skips already-paid requests)
 *   - Audit trail (records paymentId and paidAt timestamp)
 */
const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured');
            return res.status(500).json({ message: 'Webhook secret not configured' });
        }

        // Verify signature using RAW body (not parsed JSON)
        const signature = req.headers['x-razorpay-signature'];
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(req.rawBody) // Must use raw body for correct signature
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Webhook signature mismatch');
            return res.status(400).json({ message: 'Invalid webhook signature' });
        }

        const event = req.body.event;
        console.log(`📨 Webhook received: ${event}`);

        // Handle payment_link.paid event
        if (event === 'payment_link.paid') {
            const paymentLinkEntity = req.body.payload.payment_link.entity;
            const paymentEntity = req.body.payload.payment.entity;
            const paymentLinkId = paymentLinkEntity.id;

            // Find the demo request by payment link ID
            const demoRequest = await DemoRequest.findOne({ paymentLinkId });
            if (!demoRequest) {
                console.log(`⚠ No demo request found for payment link: ${paymentLinkId}`);
                return res.status(200).json({ status: 'no matching request' });
            }

            // Idempotency — skip if already processed
            if (demoRequest.paymentStatus === 'paid') {
                console.log(`ℹ Payment already processed for: ${paymentLinkId}`);
                return res.status(200).json({ status: 'already processed' });
            }

            // Update demo request
            demoRequest.paymentStatus = 'paid';
            demoRequest.status = 'paid';
            demoRequest.paymentId = paymentEntity.id;
            demoRequest.paidAt = new Date();
            await demoRequest.save();

            console.log(`✅ Payment confirmed for ${demoRequest.schoolName} — ₹${demoRequest.amount}`);
        }

        // Always respond 200 to Razorpay (even for events we don't handle)
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('❌ Webhook processing error:', err);
        // Still return 200 so Razorpay doesn't retry indefinitely
        res.status(200).json({ status: 'error logged' });
    }
};

// ============================================================
// DASHBOARD STATS
// ============================================================

/**
 * Dashboard stats for Super Admin
 */
const getDashboardStats = async (req, res) => {
    try {
        const [totalSchools, activeSchools, totalStudents, totalTeachers, pendingDemos, totalDemos] = await Promise.all([
            Admin.countDocuments(),
            Admin.countDocuments({ isActive: true }),
            Student.countDocuments(),
            Teacher.countDocuments(),
            DemoRequest.countDocuments({ status: 'pending' }),
            DemoRequest.countDocuments(),
        ]);

        res.json({
            totalSchools,
            activeSchools,
            inactiveSchools: totalSchools - activeSchools,
            totalStudents,
            totalTeachers,
            pendingDemos,
            totalDemos,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
    }
};

module.exports = {
    superAdminLogin,
    createSchool,
    getAllSchools,
    toggleSchoolStatus,
    updateSchoolPlan,
    updateSchoolInfo,
    getDemoRequests,
    updateDemoRequestStatus,
    getDashboardStats,
    razorpayWebhook,
};
