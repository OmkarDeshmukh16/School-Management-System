import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Grid, MenuItem, Select, TextField } from '@mui/material';
import styled from 'styled-components';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const ShowFees = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { studentsList, loading } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const [selectedSclass, setSelectedSclass] = useState("");
    const [classFee, setClassFee] = useState("");
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        // Only dispatch if currentUser and _id exist
        if (currentUser?._id) {
            dispatch(getAllStudents(currentUser._id));
        }
    }, [currentUser?._id, dispatch]);
    const handleSetFees = async () => {
        if (!selectedSclass || !classFee) {
            setMessage("Please select a cohort and specify the amount.");
            setSeverity("error");
            setShowPopup(true);
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/SetClassFees`, {
                sclassName: selectedSclass,
                totalAmount: classFee,
                school: currentUser._id
            });
            setMessage(`Success: Fees updated for the selected Class.`);
            setSeverity("success");
            setShowPopup(true);
            dispatch(getAllStudents(currentUser._id)); // Refresh the table
        } catch (err) {
            setMessage("Registry update failed.");
            setSeverity("error");
            setShowPopup(true);
        }
    };
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Georgia', mb: 3, textTransform: 'uppercase' }}>
                Institutional Fee Registry
            </Typography>
            <DossierPaper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#fdfcf8', border: '1px dashed #1a1a1a' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Georgia', fontSize: '1rem', mb: 2 }}>
                    Bulk Fee Configuration
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <LabelText>Target Cohort</LabelText>
                        <ClassicSelect
                            fullWidth
                            value={selectedSclass}
                            onChange={(e) => setSelectedSclass(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Class</MenuItem>
                            {sclassesList && sclassesList.map((item) => (
                                <MenuItem key={item._id} value={item._id}>{item.sclassName}</MenuItem>
                            ))}
                        </ClassicSelect>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <LabelText>Annual Tuition Fee (INR)</LabelText>
                        <ClassicTextField
                            fullWidth
                            type="number"
                            value={classFee}
                            onChange={(e) => setClassFee(e.target.value)}
                            placeholder="e.g. 80000"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Primary3DButton onClick={handleSetFees} style={{ marginTop: '20px', width: '100%' }}>
                            Apply to All Students
                        </Primary3DButton>
                    </Grid>
                </Grid>
            </DossierPaper>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0dcd0', borderRadius: 0 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a1a1a' }}>
                        <TableRow>
                            <StyledHeaderCell>Scholar Name</StyledHeaderCell>
                            <StyledHeaderCell>Roll No.</StyledHeaderCell>
                            <StyledHeaderCell>Total Fee</StyledHeaderCell>
                            <StyledHeaderCell>Paid</StyledHeaderCell>
                            <StyledHeaderCell>Balance</StyledHeaderCell>
                            <StyledHeaderCell>Status</StyledHeaderCell>
                            <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentsList.map((student) => (
                            <TableRow key={student._id} sx={{ '&:hover': { bgcolor: '#fdfcf8' } }}>
                                <TableCell sx={{ fontFamily: 'serif' }}>{student.name}</TableCell>
                                <TableCell sx={{ fontFamily: 'serif' }}>{student.rollNum}</TableCell>
                                <TableCell sx={{ fontFamily: 'serif' }}>₹{student.fees?.totalAmount || 0}</TableCell>
                                <TableCell sx={{ fontFamily: 'serif', color: 'green' }}>₹{student.fees?.paidAmount || 0}</TableCell>
                                <TableCell sx={{ fontFamily: 'serif', color: student.fees?.balanceAmount > 0 ? 'red' : 'inherit' }}>
                                    ₹{student.fees?.balanceAmount || 0}
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={student.fees?.paymentStatus}>
                                        {student.fees?.paymentStatus || 'Pending'}
                                    </StatusChip>
                                </TableCell>
                                <TableCell align="center">
                                    <CollectButton onClick={() => navigate(`/Admin/students/student/fees/${student._id}`)}>
                                        Manage Ledger
                                    </CollectButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ShowFees;

// --- STYLED COMPONENTS ---
const DossierPaper = styled(Paper)`
    && { background-color: #fdfcf8; border: 1px dashed #1a1a1a; }
`;

const LabelText = styled.label`
    display: block; margin-bottom: 8px; font-family: 'Georgia', serif; 
    font-size: 0.875rem; font-weight: 500; color: #1a1a1a;
`;

const ClassicSelect = styled(Select)`
    && { font-family: 'Georgia', serif; border-radius: 0; }
    && .MuiOutlinedInput-root { font-family: 'Georgia', serif; }
`;

const ClassicTextField = styled(TextField)`
    && { font-family: 'Georgia', serif; }
    && .MuiOutlinedInput-root { font-family: 'Georgia', serif; }
    && input { font-family: 'Georgia', serif; }
`;

const Primary3DButton = styled.button`
    background: #1a1a1a; color: white; border: none; padding: 10px 20px; 
    font-family: 'Georgia', serif; text-transform: uppercase; cursor: pointer; 
    font-size: 0.875rem; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    &:hover { 
        background: #333; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateY(-2px);
    }
`;

const StyledHeaderCell = styled(TableCell)` && { color: white; font-family: 'Georgia', serif; font-size: 0.75rem; text-transform: uppercase; } `;

const StatusChip = styled.span`
    font-size: 0.65rem; padding: 3px 8px; border: 1px solid #1a1a1a; text-transform: uppercase;
    background: ${props => props.status === 'Paid' ? '#e8f5e9' : props.status === 'Partial' ? '#fff3e0' : '#ffebee'};
`;

const CollectButton = styled.button`
    background: #1a1a1a; color: white; border: none; padding: 5px 10px; font-family: serif; 
    text-transform: uppercase; cursor: pointer; font-size: 0.7rem;
    &:hover { background: #333; }
`;