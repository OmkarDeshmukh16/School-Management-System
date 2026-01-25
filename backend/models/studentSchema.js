const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: Date, // Date of birth
    },
    nationality: {
        type: String,
    },
    motherTongue: {
        type: String,
    },
    religion: {
        type: String,
    },
    caste: {
        type: String,
    },
    subCaste: {
        type: String,
    },
    birthPlace: {
        type: String,
    },
    phone: {
        type: String, // Mob no.
    },
    address: {
        type: String,
    },
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        subName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        }
    }],
    fees: {
        totalAmount: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        balanceAmount: { type: Number, default: 0 },
        paymentStatus: { 
            type: String, 
            enum: ['Paid', 'Pending', 'Partial'], 
            default: 'Pending' 
        },
        transactions: [{
            amount: Number,
            date: { type: Date, default: Date.now },
            paymentMethod: String, // e.g., Cash, UPI, Online
            receiptNo: String
        }]
    }
});

module.exports = mongoose.model("student", studentSchema);