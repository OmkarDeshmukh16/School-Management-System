const mongoose = require("mongoose");

const demoRequestSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "contacted", "interested", "payment_pending", "paid", "onboarded", "rejected"],
        default: "pending",
    },
    // --- Payment fields ---
    paymentLink: {
        type: String,
        default: "",
    },
    paymentLinkId: {
        type: String,
        default: "",
    },
    paymentStatus: {
        type: String,
        enum: ["not_paid", "paid"],
        default: "not_paid",
    },
    amount: {
        type: Number,
        default: 0,
    },
    paymentId: {
        type: String,
        default: "",
    },
    paidAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("demorequest", demoRequestSchema);
