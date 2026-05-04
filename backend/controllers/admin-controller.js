const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');
const { generateToken } = require('../middleware/auth.js');


const adminRegister = async (req, res) => {
    try {
        const admin = new Admin({
            ...req.body
        });

        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(req.body.password, salt);
            let result = await admin.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            // Check if school is deactivated
            if (admin.isActive === false) {
                return res.send({ message: "Your school account has been deactivated. Please contact the platform administrator." });
            }

            let isValid = false;
            // Check for bcrypt hash or fallback to plaintext for old accounts
            if (admin.password.startsWith('$2')) {
                isValid = await bcrypt.compare(req.body.password, admin.password);
            } else {
                isValid = (req.body.password === admin.password);
            }

            if (isValid) {
                // Generate JWT token
                const token = generateToken({
                    id: admin._id,
                    role: admin.role,
                    schoolId: admin.schoolId,
                });

                admin.password = undefined;
                const adminData = admin.toObject();
                adminData.token = token;
                res.send(adminData);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// Ensure these fields are allowed in your update function
const updateAdmin = async (req, res) => {
    try {
        // Explicitly list all fields to be updated
        const { 
            name, email, password, schoolName, 
            udiseNumber, recognitionNumber, board, 
            medium, address, mobile, schoolLogo, bankDetails
        } = req.body;

        const updateData = { 
            name, email, schoolName, 
            udiseNumber, recognitionNumber, board, 
            medium, address, mobile, schoolLogo, bankDetails 
        };

        // Hash password only if it's being changed
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const result = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        // Hide password in response
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err });
    }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail, updateAdmin};
