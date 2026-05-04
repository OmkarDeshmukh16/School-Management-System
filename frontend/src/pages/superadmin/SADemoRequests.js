import React, { useEffect, useState } from 'react';
import {
    Box, CircularProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Select, MenuItem, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Snackbar, Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import styled from 'styled-components';
import axios from 'axios';
import { BASEURL } from '../../utils/apiConfig';

const SADemoRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState(null); // { id, status }
    const [paymentAmount, setPaymentAmount] = useState('1000');
    const [actionLoading, setActionLoading] = useState(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.get(`${BASEURL}/SuperAdmin/DemoRequests`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch demo requests:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * When user selects a new status:
     * - If "payment_pending", show confirmation dialog first
     * - Otherwise, update immediately
     */
    const handleStatusSelect = (id, newStatus) => {
        if (newStatus === 'payment_pending') {
            setConfirmTarget({ id, status: newStatus });
            setPaymentAmount('1000');
            setConfirmOpen(true);
        } else {
            executeStatusChange(id, newStatus);
        }
    };

    /**
     * Execute the actual status change API call
     */
    const executeStatusChange = async (id, newStatus, amount = null) => {
        setActionLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = { status: newStatus };
            if (amount) payload.amount = Number(amount);

            const res = await axios.put(`${BASEURL}/SuperAdmin/DemoRequest/${id}`, payload, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            // Update local state from API response (includes payment fields)
            setRequests(prev =>
                prev.map(r => r._id === id ? res.data.request : r)
            );

            setSnackbar({
                open: true,
                message: newStatus === 'payment_pending'
                    ? '✅ Payment link created & email sent!'
                    : `Status updated to "${newStatus}"`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to update status:', error);
            const errMsg = error.response?.data?.message || 'Failed to update status';
            setSnackbar({ open: true, message: `❌ ${errMsg}`, severity: 'error' });
        } finally {
            setActionLoading(false);
            setConfirmOpen(false);
            setConfirmTarget(null);
        }
    };

    /**
     * Confirm payment_pending action from dialog
     */
    const handleConfirmPayment = () => {
        if (confirmTarget) {
            executeStatusChange(confirmTarget.id, confirmTarget.status, paymentAmount);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fff8e1', color: '#f57f17', border: '#ffe082' };
            case 'contacted': return { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' };
            case 'interested': return { bg: '#f3e5f5', color: '#7b1fa2', border: '#ce93d8' };
            case 'payment_pending': return { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' };
            case 'paid': return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
            case 'onboarded': return { bg: '#e0f2f1', color: '#00695c', border: '#80cbc4' };
            case 'rejected': return { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' };
            default: return { bg: '#f5f5f5', color: '#666', border: '#ddd' };
        }
    };

    const getPaymentBadgeStyle = (paymentStatus) => {
        if (paymentStatus === 'paid') {
            return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7', label: 'PAID' };
        }
        return { bg: '#fff3e0', color: '#e65100', border: '#ffb74d', label: 'NOT PAID' };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                <CircularProgress sx={{ color: '#1a1a1a' }} />
            </Box>
        );
    }

    return (
        <div>
            <PageHeader>
                <div>
                    <PageTitle>Demo Requests</PageTitle>
                    <PageSubtitle>Manage incoming demo and contact requests from schools</PageSubtitle>
                </div>
                <Tooltip title="Refresh">
                    <RefreshButton onClick={fetchRequests}>
                        <RefreshIcon />
                    </RefreshButton>
                </Tooltip>
            </PageHeader>

            {requests.length === 0 ? (
                <EmptyState>
                    <EmptyText>No demo requests yet.</EmptyText>
                </EmptyState>
            ) : (
                <StyledTableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <StyledHeaderRow>
                                <StyledHeaderCell>#</StyledHeaderCell>
                                <StyledHeaderCell>School Name</StyledHeaderCell>
                                <StyledHeaderCell>Contact Person</StyledHeaderCell>
                                <StyledHeaderCell>Phone</StyledHeaderCell>
                                <StyledHeaderCell>Email</StyledHeaderCell>
                                <StyledHeaderCell>Message</StyledHeaderCell>
                                <StyledHeaderCell>Date</StyledHeaderCell>
                                <StyledHeaderCell>Amount</StyledHeaderCell>
                                <StyledHeaderCell>Payment</StyledHeaderCell>
                                <StyledHeaderCell>Link</StyledHeaderCell>
                                <StyledHeaderCell>Status</StyledHeaderCell>
                            </StyledHeaderRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req, index) => {
                                const statusStyle = getStatusColor(req.status);
                                const paymentBadge = getPaymentBadgeStyle(req.paymentStatus);
                                return (
                                    <StyledRow key={req._id}>
                                        <StyledCell>{index + 1}</StyledCell>
                                        <StyledCell><strong>{req.schoolName}</strong></StyledCell>
                                        <StyledCell>{req.contactPerson}</StyledCell>
                                        <StyledCell>{req.phone}</StyledCell>
                                        <StyledCell>{req.email}</StyledCell>
                                        <StyledCell>
                                            <MessageText>{req.message || '—'}</MessageText>
                                        </StyledCell>
                                        <StyledCell>
                                            {new Date(req.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </StyledCell>
                                        {/* Amount */}
                                        <StyledCell>
                                            {req.amount > 0 ? `₹${req.amount.toLocaleString('en-IN')}` : '—'}
                                        </StyledCell>
                                        {/* Payment Status Badge */}
                                        <StyledCell>
                                            {req.paymentLink ? (
                                                <PaymentBadge
                                                    style={{
                                                        backgroundColor: paymentBadge.bg,
                                                        color: paymentBadge.color,
                                                        border: `1px solid ${paymentBadge.border}`,
                                                    }}
                                                >
                                                    {paymentBadge.label}
                                                </PaymentBadge>
                                            ) : '—'}
                                        </StyledCell>
                                        {/* Payment Link */}
                                        <StyledCell>
                                            {req.paymentLink ? (
                                                <Tooltip title="Open payment link">
                                                    <PaymentLinkButton
                                                        href={req.paymentLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <OpenInNewIcon style={{ fontSize: 16 }} />
                                                    </PaymentLinkButton>
                                                </Tooltip>
                                            ) : '—'}
                                        </StyledCell>
                                        {/* Status Dropdown */}
                                        <StyledCell>
                                            <StyledSelect
                                                value={req.status}
                                                onChange={(e) => handleStatusSelect(req._id, e.target.value)}
                                                size="small"
                                                disabled={actionLoading}
                                                sx={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    border: `1px solid ${statusStyle.border}`,
                                                    fontFamily: "'Georgia', serif",
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    borderRadius: 0,
                                                    '& .MuiSelect-select': { py: 0.5, px: 1 },
                                                    '& fieldset': { border: 'none' },
                                                }}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="contacted">Contacted</MenuItem>
                                                <MenuItem value="interested">Interested</MenuItem>
                                                <MenuItem value="payment_pending">Payment Pending</MenuItem>
                                                <MenuItem value="paid">Paid</MenuItem>
                                                <MenuItem value="onboarded">Onboarded</MenuItem>
                                                <MenuItem value="rejected">Rejected</MenuItem>
                                            </StyledSelect>
                                        </StyledCell>
                                    </StyledRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            )}

            {/* ── Confirmation Dialog for Payment Pending ── */}
            <Dialog
                open={confirmOpen}
                onClose={() => { setConfirmOpen(false); setConfirmTarget(null); }}
                PaperProps={{
                    sx: {
                        borderRadius: 0,
                        border: '1px solid #e0dcd0',
                        boxShadow: '4px 4px 0px #e0dcd0',
                        minWidth: 420,
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: "'Georgia', serif", fontSize: '1.2rem', borderBottom: '1px solid #e0dcd0', pb: 2 }}>
                    Send Payment Link?
                </DialogTitle>
                <DialogContent sx={{ pt: '24px !important' }}>
                    <Box sx={{ mb: 2 }}>
                        <DialogLabel>This will:</DialogLabel>
                        <DialogList>
                            <li>Generate a Razorpay payment link (expires in 24 hours)</li>
                            <li>Send an email to the client with the payment link</li>
                            <li>Set status to "Payment Pending"</li>
                        </DialogList>
                    </Box>
                    <TextField
                        label="Onboarding Amount (₹)"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                            sx: {
                                fontFamily: "'Georgia', serif",
                                borderRadius: 0,
                            }
                        }}
                        InputLabelProps={{
                            sx: { fontFamily: "'Georgia', serif" }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #e0dcd0' }}>
                    <CancelButton
                        onClick={() => { setConfirmOpen(false); setConfirmTarget(null); }}
                        disabled={actionLoading}
                    >
                        Cancel
                    </CancelButton>
                    <ConfirmButton
                        onClick={handleConfirmPayment}
                        disabled={actionLoading || !paymentAmount || Number(paymentAmount) <= 0}
                    >
                        {actionLoading ? 'Creating…' : 'Send Payment Link'}
                    </ConfirmButton>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar Notifications ── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    sx={{ fontFamily: "'Georgia', serif", borderRadius: 0 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SADemoRequests;

// --- STYLED COMPONENTS ---

const PageHeader = styled.div`
    margin-bottom: 30px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const PageTitle = styled.h1`
    font-family: 'Georgia', serif;
    font-size: 1.8rem;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 8px 0;
    font-weight: 400;
`;

const PageSubtitle = styled.p`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
    font-size: 0.9rem;
    margin: 0;
`;

const RefreshButton = styled(IconButton)`
    && {
        border: 1px solid #e0dcd0;
        border-radius: 0;
        color: #1a1a1a;
        &:hover { background-color: #f4f1ea; }
    }
`;

const StyledTableContainer = styled(TableContainer)`
    && {
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 4px 4px 0px #e0dcd0;
        overflow-x: auto;
    }
`;

const StyledHeaderRow = styled(TableRow)`
    && {
        background-color: #1a1a1a;
    }
`;

const StyledHeaderCell = styled(TableCell)`
    && {
        color: #ffffff;
        font-family: 'Georgia', serif;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: none;
        padding: 14px 12px;
        white-space: nowrap;
    }
`;

const StyledRow = styled(TableRow)`
    && {
        &:nth-of-type(even) { background-color: #fdfcf8; }
        &:hover { background-color: #f4f1ea; }
        border-bottom: 1px solid #e0dcd0;
    }
`;

const StyledCell = styled(TableCell)`
    && {
        font-family: 'Georgia', serif;
        font-size: 0.82rem;
        color: #333;
        padding: 10px 12px;
        border-bottom: 1px solid #f0ece4;
        white-space: nowrap;
    }
`;

const MessageText = styled.span`
    display: inline-block;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StyledSelect = styled(Select)``;

const PaymentBadge = styled.span`
    display: inline-block;
    padding: 3px 10px;
    font-family: 'Georgia', serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
`;

const PaymentLinkButton = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid #e0dcd0;
    color: #1a1a1a;
    text-decoration: none;
    transition: all 0.2s;
    &:hover {
        background-color: #1a1a1a;
        color: #ffffff;
        border-color: #1a1a1a;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 60px;
    border: 1px dashed #e0dcd0;
`;

const EmptyText = styled.p`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
    font-size: 1.1rem;
`;

const DialogLabel = styled.p`
    font-family: 'Georgia', serif;
    font-size: 0.9rem;
    color: #333;
    margin: 0 0 8px 0;
`;

const DialogList = styled.ul`
    font-family: 'Georgia', serif;
    font-size: 0.85rem;
    color: #555;
    margin: 0 0 20px 0;
    padding-left: 20px;
    line-height: 1.8;
`;

const CancelButton = styled(Button)`
    && {
        font-family: 'Georgia', serif;
        color: #666;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.75rem;
        padding: 8px 20px;
        &:hover { background-color: #f4f1ea; }
    }
`;

const ConfirmButton = styled(Button)`
    && {
        font-family: 'Georgia', serif;
        background-color: #1a1a1a;
        color: #ffffff;
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.75rem;
        padding: 8px 24px;
        &:hover { background-color: #333; }
        &:disabled { background-color: #ccc; color: #888; }
    }
`;
