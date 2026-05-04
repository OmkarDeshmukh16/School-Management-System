/**
 * Seed script: Creates the default Super Admin account
 * Run once: node seedSuperAdmin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const SuperAdmin = require('./models/superAdminSchema.js');

const SUPER_ADMIN = {
    name: 'Platform Admin',
    email: 'superadmin@omsaas.com',
    password: 'Admin@123',
};

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Check if super admin already exists
        const existing = await SuperAdmin.findOne({ email: SUPER_ADMIN.email });
        if (existing) {
            console.log('Super Admin already exists. Skipping seed.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, salt);

        // Create super admin
        const superAdmin = new SuperAdmin({
            name: SUPER_ADMIN.name,
            email: SUPER_ADMIN.email,
            password: hashedPassword,
        });

        await superAdmin.save();
        console.log('\n=== Super Admin Created Successfully ===');
        console.log(`Email:    ${SUPER_ADMIN.email}`);
        console.log(`Password: ${SUPER_ADMIN.password}`);
        console.log('========================================');
        console.log('\n⚠️  Change these credentials after first login!\n');

        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
};

seedSuperAdmin();
