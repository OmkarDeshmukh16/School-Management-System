import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import { generateReceipt } from '../../utils/receiptGenerator';

const StudentTransactionHistory = ({ student }) => {
    const transactions = student.fees?.transactions || [];

    return (
        <HistoryWrapper>
            <Box sx={{ mb: 3 }}>
                <TypographyClassic variant="h6">Transaction History</TypographyClassic>
                <TypographySubtitle>A permanent record of all settled institutional dues</TypographySubtitle>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0dcd0', borderRadius: 0 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#1a1a1a' }}>
                        <TableRow>
                            <StyledHeaderCell>Date</StyledHeaderCell>
                            <StyledHeaderCell>Receipt No.</StyledHeaderCell>
                            <StyledHeaderCell>Method</StyledHeaderCell>
                            <StyledHeaderCell align="right">Amount</StyledHeaderCell>
                            <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <StyledRow key={index}>
                                    <TableCell sx={{ fontFamily: 'serif' }}>
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                                        {transaction.receiptNo}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'serif' }}>
                                        {transaction.paymentMethod}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Georgia', fontWeight: 'bold' }}>
                                        ₹{transaction.amount}
                                    </TableCell>
                                    <TableCell align="center">
                                        <DownloadButton onClick={() => generateReceipt(student, transaction)}>
                                            <DownloadIcon fontSize="inherit" sx={{ mr: 1 }} />
                                            Receipt
                                        </DownloadButton>
                                    </TableCell>
                                </StyledRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, fontFamily: 'serif', fontStyle: 'italic' }}>
                                    No transaction records found in the ledger.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </HistoryWrapper>
    );
};

export default StudentTransactionHistory;

// --- STYLED COMPONENTS ---

const HistoryWrapper = styled(Box)`
    margin-top: 40px;
`;

const TypographyClassic = styled(Typography)`
    && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; color: #1a1a1a; }
`;

const TypographySubtitle = styled.p`
    font-family: serif; font-style: italic; color: #7d6b5d; margin: 0; font-size: 0.85rem;
`;

const StyledHeaderCell = styled(TableCell)`
    && { color: white; font-family: 'Georgia', serif; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; }
`;

const StyledRow = styled(TableRow)`
    &:nth-of-type(even) { background-color: #fdfcf8; }
    &:hover { background-color: #f4f1ea; }
`;

const DownloadButton = styled.button`
    background: none; border: 1px solid #1a1a1a; color: #1a1a1a;
    padding: 4px 12px; font-family: serif; text-transform: uppercase;
    font-size: 0.65rem; cursor: pointer; display: flex; align-items: center;
    &:hover { background-color: #1a1a1a; color: white; }
`;