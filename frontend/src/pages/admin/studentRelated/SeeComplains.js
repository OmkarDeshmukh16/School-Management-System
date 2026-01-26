import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, Checkbox, Typography, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import axios from 'axios';

const SeeComplains = () => {
    const dispatch = useDispatch();
    const { complainsList, loading, error, response } = useSelector((state) => state.complain);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllComplains(currentUser._id, "Complain"));
    }, [currentUser._id, dispatch]);

    const handleResolve = async (id) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Complain/${id}`);
            if (res.status === 200) {
                // Re-fetch list to update UI after deletion
                dispatch(getAllComplains(currentUser._id, "Complain"));
            }
        } catch (err) {
            console.error("Resolution failed", err);
        }
    };

    const complainColumns = [
        { id: 'user', label: 'Petitioner', minWidth: 170 },
        { id: 'complaint', label: 'Grievance Details', minWidth: 100 },
        { id: 'date', label: 'Date Filed', minWidth: 170 },
    ];

    const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
        const date = new Date(complain.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            // FIX: Added optional chaining and fallback for null users
            user: complain.user?.name || "Deleted Scholar/Anonymous",
            complaint: complain.complaint,
            date: dateString,
            id: complain._id,
        };
    });

    const ComplainButtonHaver = ({ row }) => {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <ClassicCheckbox 
                    color="default"
                    inputProps={{ 'aria-label': 'Mark as Resolved' }} 
                    onChange={() => handleResolve(row.id)} // Link to resolve logic
                />
                <Typography sx={{ fontSize: '10px', fontFamily: 'serif', color: '#7d6b5d' }}>RESOLVE</Typography>
            </Box>
        );
    };

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Grievance Ledger</TypographyClassic>
                    <TypographySubtitle>Formal record of student and faculty concerns</TypographySubtitle>
                </Box>
            </RegistryHeader>

            {loading ? (
                <LoaderContainer>
                    <CircularProgress color="inherit" />
                </LoaderContainer>
            ) : (
                <>
                    {response ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 1 }}>
                                The ledger is currently clear.
                            </Typography>
                            <TypographySubtitle>No outstanding grievances recorded.</TypographySubtitle>
                        </EmptyState>
                    ) : (
                        <TableWrapper>
                            {Array.isArray(complainsList) && complainsList.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={ComplainButtonHaver} 
                                    columns={complainColumns} 
                                    rows={complainRows} 
                                />
                            )}
                        </TableWrapper>
                    )}
                </>
            )}
        </RegistryContainer>
    );
};

export default SeeComplains;

// --- CLASSIC STYLED COMPONENTS ---

const RegistryContainer = styled(Box)`
    padding: 20px;
`;

const RegistryHeader = styled(Box)`
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
`;

const TypographyClassic = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        color: #1a1a1a;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
`;

const TypographySubtitle = styled.p`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
    margin: 5px 0 0 0;
`;

const TableWrapper = styled(Paper)`
    && {
        border-radius: 0;
        border: 1px solid #e0dcd0;
        box-shadow: none;
        background-color: #ffffff;
        
        & .MuiTableCell-head {
            background-color: #1a1a1a;
            color: white;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.85rem;
        }

        & .MuiTableCell-body {
            font-family: 'serif';
            color: #444;
        }
    }
`;

const ClassicCheckbox = styled(Checkbox)`
    && {
        color: #7d6b5d;
        &.Mui-checked {
            color: #1a1a1a;
        }
    }
`;

const EmptyState = styled(Box)`
    text-align: center;
    padding: 80px 60px;
    border: 1px dashed #e0dcd0;
    background-color: #fdfcf8;
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
    color: #1a1a1a;
`;