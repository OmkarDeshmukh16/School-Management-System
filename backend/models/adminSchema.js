const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Admin"
    },
    schoolName: {
        type: String,
        unique: true,
        required: true
    },
    udiseNumber: {
        type: String
    },
    recognitionNumber: { type: String },
    board: {
        type: String
    },
    medium: {
        type: String
    },
    address: { type: String },
    mobile: { type: String },
    schoolLogo: { type: String },

    bankDetails: {
        accountHolderName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
        bankName: { type: String, default: "" },
        branchName: { type: String, default: "" }
    }
});

module.exports = mongoose.model("admin", adminSchema)