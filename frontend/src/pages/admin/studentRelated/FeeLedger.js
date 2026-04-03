import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, TextField, Button, Grid, Divider, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from 'axios';
import { BASEURL } from '../../../utils/apiConfig';
import { getUserDetails } from '../../../redux/userRelated/userHandle'; // Ensure this path is correct

const FeeLedger = ({ currentUser }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    // 1. Get student data from Redux
    const { userDetails: student, loading } = useSelector((state) => state.user);
    
    // 2. Initialize state
    const [payment, setPayment] = useState({ amount: '', method: 'Cash' });

    // 3. Fetch data on mount
    useEffect(() => {
        dispatch(getUserDetails(id, "Student"));
    }, [dispatch, id]);

    // 4. Loading State Guard
    if (loading || !student || Object.keys(student).length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 10 }}>
                <CircularProgress color="inherit" />
                <Typography sx={{ ml: 2, mt: 2, fontFamily: 'serif', fontStyle: 'italic' }}>
                    Accessing Institutional Ledger...
                </Typography>
            </Box>
        );
    }

    // Derived values for cleaner JSX
    const totalAmount = student?.fees?.totalAmount || 0;
    const paidAmount = student?.fees?.paidAmount || 0;
    const balanceAmount = student?.fees?.balanceAmount || 0;

    const sendFeeReminder = async () => {
        const noticeFields = {
            title: "Urgent: Institutional Fee Reminder",
            details: `Your current outstanding balance is ₹${balanceAmount}. Please settle the dues to avoid academic holds.`,
            date: new Date(),
            adminID: currentUser?._id,
            targetStudent: student?._id
        };

        try {
            await axios.post(`${BASEURL}/FeeNotice`, noticeFields);
            alert("Institutional Demand Notice has been dispatched to the scholar.");
        } catch (err) {
            console.error("Failed to send notice", err);
        }
    };

    const handlePayment = async () => {
        if (!payment.amount || payment.amount <= 0) {
            alert("Please enter a valid installment amount.");
            return;
        }

        try {
            const res = await axios.put(`${BASEURL}/CollectFees/${student._id}`, {
                amount: payment.amount,
                paymentMethod: payment.method,
            });

            if (res.status === 200) {
                alert(`Installment of ₹${payment.amount} recorded. New balance: ₹${res.data.balanceAmount}`);
                window.location.reload(); 
            }
        } catch (err) {
            alert("Ledger update failed. Check if amount exceeds balance.");
        }
    };

    return (
        <DossierPaper elevation={0}>
            <SectionHeader>
                <AccountBalanceWalletIcon sx={{ mr: 1, color: '#1a1a1a' }} />
                <TypographyClassic variant="h6">Institutional Fee Ledger</TypographyClassic>
            </SectionHeader>

            {/* Financial Overview Cards */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <LabelText>Total Tuition</LabelText>
                    <ValueText>₹{totalAmount}</ValueText>
                </Grid>
                <Grid item xs={12} md={4}>
                    <LabelText>Total Settled</LabelText>
                    <ValueText sx={{ color: '#2e7d32' }}>₹{paidAmount}</ValueText>
                </Grid>
                <Grid item xs={12} md={4}>
                    <LabelText>Outstanding Balance</LabelText>
                    <ValueText sx={{ color: '#d32f2f' }}>₹{balanceAmount}</ValueText>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Transaction Entry Section */}
            <Box>
                <SectionHeading>Record New Transaction</SectionHeading>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} md={5}>
                        <LabelText>Transaction Amount (INR)</LabelText>
                        <ClassicTextField
                            fullWidth
                            type="number"
                            size="small"
                            value={payment.amount}
                            onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
                        />
                        <ClassicOutlineButton fullWidth onClick={sendFeeReminder}>
                            Dispatch Demand Notice
                        </ClassicOutlineButton>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <LabelText>Method</LabelText>
                        <ClassicTextField
                            fullWidth
                            select
                            size="small"
                            value={payment.method}
                            SelectProps={{ native: true }}
                            onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                        >
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI/Digital</option>
                            <option value="Cheque">Bank Cheque</option>
                        </ClassicTextField>
                    </Grid>

                    <Grid item xs={12} md={3} sx={{ mt: '24px' }}>
                        <Primary3DButton onClick={handlePayment}>
                            Authorize Payment
                        </Primary3DButton>
                    </Grid>
                </Grid>
            </Box>
        </DossierPaper>
    );
};

// --- STYLED COMPONENTS (Keep as they are) ---
const DossierPaper = styled(Paper)`
    && { padding: 40px; border: 1px solid #e0dcd0; border-radius: 0; background: #ffffff; margin-top: 20px; }
`;
const SectionHeader = styled(Box)` display: flex; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; `;
const TypographyClassic = styled(Typography)` && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; } `;
const SectionHeading = styled(Typography)` && { font-family: 'Georgia', serif; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 15px; color: #7d6b5d; } `;
const LabelText = styled.p` font-family: serif; font-size: 0.7rem; text-transform: uppercase; color: #7d6b5d; font-weight: bold; margin: 0; `;
const ValueText = styled(Typography)` && { font-family: 'Georgia', serif; font-size: 1.5rem; font-weight: bold; color: #1a1a1a; } `;
const ClassicTextField = styled(TextField)` & .MuiOutlinedInput-root { border-radius: 0; font-family: serif; background: #fdfcf8; & fieldset { border-color: #e0dcd0; } } `;
const Primary3DButton = styled.button` width: 100%; background: #1a1a1a; color: white; border: none; padding: 11px; font-family: 'Georgia', serif; text-transform: uppercase; box-shadow: 3px 3px 0px #7d6b5d; cursor: pointer; transition: 0.2s; &:active { transform: translate(2px, 2px); box-shadow: none; } `;
const ClassicOutlineButton = styled(Button)` && { margin-top: 15px; font-family: 'Georgia', serif; text-transform: uppercase; font-size: 0.7rem; color: #d32f2f; border-color: #d32f2f; border-radius: 0; border: 1px solid; background: #fdfcf8; &:hover { background: #fff5f5; border-color: #d32f2f; } } `;

export default FeeLedger;