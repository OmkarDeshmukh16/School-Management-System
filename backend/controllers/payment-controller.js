const Razorpay = require('razorpay');
const crypto = require('crypto');
const Student = require('../models/studentSchema');

const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay API Keys are missing in .env");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// Step 1: Create Order
const createOrder = async (req, res) => {
    try {
        const razorpay = getRazorpayInstance(); // Initialize here
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Step 2: Verify Signature & Update Ledger
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentID, amount } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update Student Fee Ledger
            const student = await Student.findById(studentID);
            student.fees.paidAmount += Number(amount);
            student.fees.balanceAmount -= Number(amount);
            
            if (student.fees.balanceAmount <= 0) student.fees.paymentStatus = 'Paid';
            else student.fees.paymentStatus = 'Partial';

            student.fees.transactions.push({
                amount: amount,
                paymentMethod: "Razorpay Online",
                receiptNo: `PAY-${razorpay_payment_id}`
            });

            await student.save();
            return res.status(200).json({ message: "Payment verified and record updated" });
        } else {
            return res.status(400).json({ message: "Invalid signature" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { createOrder, verifyPayment };