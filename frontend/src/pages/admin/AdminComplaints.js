import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains } from '../../redux/complainRelated/complainHandle';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';

const AdminComplaints = () => {
    const dispatch = useDispatch();
    const { complainsList, loading, error, response } = useSelector((state) => state.complain);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllComplains(currentUser._id, "Complain"));
    }, [currentUser._id, dispatch]);

    const handleResolve = async (id) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Complain/${id}`);
        if (res.status === 200) {
            // Trigger a re-fetch of the complaints list
            dispatch(getAllComplains(currentUser._id, "Complain"));
            alert("Grievance marked as resolved.");
        }
    } catch (err) {
        console.error("Resolution failed", err);
        alert("Could not finalize grievance resolution.");
    }
};

    return (
        <Box sx={{ p: 4 }}>
            <TypographyClassic variant="h5" sx={{ mb: 3 }}>Institutional Grievance Inbox</TypographyClassic>

            {response ? (
                <Box sx={{ p: 2, bgcolor: '#fdfcf8', border: '1px solid #e0dcd0' }}>
                    <Typography>No active grievances currently recorded in the registry.</Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0dcd0', borderRadius: 0 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#1a1a1a' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontFamily: 'serif' }}>Scholar Name</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: 'serif' }}>Grievance Details</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: 'serif' }}>Date Submitted</TableCell>
                                <TableCell sx={{ color: 'white', fontFamily: 'serif' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {complainsList.map((complain) => (
                                <TableRow key={complain._id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fdfcf8' } }}>
                                    {/* Change complain.user.name to the code below */}
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {complain.user?.name || "Anonymous/Deleted Scholar"}
                                    </TableCell>
                                    <TableCell>{complain.complaint}</TableCell>
                                    <TableCell>{new Date(complain.date).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            onClick={() => handleResolve(complain._id)}
                                            sx={{ fontFamily: 'serif', borderRadius: 0 }}
                                        >
                                            Mark Resolved
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

const TypographyClassic = styled(Typography)`
    && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; color: #1a1a1a; }
`;

export default AdminComplaints;