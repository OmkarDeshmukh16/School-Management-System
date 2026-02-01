import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, Button, Snackbar, Alert, 
    Divider, InputAdornment, CircularProgress 
} from '@mui/material';
import { getStudentsByClass } from '../../redux/studentRelated/studentHandle';
import axios from 'axios';
import styled from 'styled-components';

const TeacherBulkMarks = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { studentsList, loading } = useSelector((state) => state.student);
    const [marksData, setMarksData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        if (currentUser?.teachSclass?._id) {
            dispatch(getStudentsByClass(currentUser.teachSclass._id, "Student"));
        }
    }, [dispatch, currentUser?.teachSclass?._id]);

    const maxMarks = 100;

    const submitMarks = async () => {
        if (Object.keys(marksData).length === 0) {
            setMessage("No entries found. Please enter marks before synchronizing.");
            setSeverity("error");
            setShowPopup(true);
            return;
        }

        try {
            const res = await axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateBulkMarks`, {
                marksData: Object.entries(marksData).map(([studentID, marksObtained]) => ({
                    studentID,
                    marksObtained,
                    subID: currentUser.teachSubject._id
                }))
            });

            if (res.status === 200) {
                setMessage("Academic records synchronized successfully!");
                setSeverity("success");
                setShowPopup(true);
            }
        } catch (err) {
            setMessage("Failed to sync records. Verify your network connection.");
            setSeverity("error");
            setShowPopup(true);
        }
    };

    const handleMarkChange = (studentID, value) => {
        if (value > maxMarks) return; // Prevent exceeding max marks
        setMarksData({ ...marksData, [studentID]: value });
    };

    return (
        <RegistryContainer>
            <HeaderSection>
                <Box>
                    <TypographyClassic variant="h4">Examination Registry</TypographyClassic>
                    <TypographySubtitle>
                        Subject: {currentUser.teachSubject?.subName} | Class: {currentUser.teachSclass?.sclassName}
                    </TypographySubtitle>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>MAXIMUM MARKS</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'Georgia' }}>{maxMarks}</Typography>
                </Box>
            </HeaderSection>

            <Divider sx={{ mb: 4, bgcolor: '#1a1a1a', height: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <TableWrapper component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '40%' }}>Scholar Name</TableCell>
                                <TableCell sx={{ width: '30%' }}>Roll Number</TableCell>
                                <TableCell align="right">Marks Obtained</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studentsList && studentsList.length > 0 ? (
                                studentsList.map((student) => (
                                    <TableRow key={student._id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fdfcf8' } }}>
                                        <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                                        <TableCell sx={{ color: '#7d6b5d' }}>{student.rollNum}</TableCell>
                                        <TableCell align="right">
                                            <StyledTextField
                                                type="number"
                                                size="small"
                                                placeholder="00"
                                                value={marksData[student._id] || ""}
                                                onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">/ {maxMarks}</InputAdornment>,
                                                } }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 10, fontStyle: 'italic' }}>
                                        No scholars found for this class. Please verify the Class Registry.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableWrapper>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Primary3DButton onClick={submitMarks}>
                    Authorize Academic Ledger
                </Primary3DButton>
            </Box>

            <Snackbar
                open={showPopup}
                autoHideDuration={4000}
                onClose={() => setShowPopup(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setShowPopup(false)} 
                    severity={severity} 
                    variant="filled" 
                    sx={{ borderRadius: 0, fontFamily: 'Georgia' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </RegistryContainer>
    );
};

export default TeacherBulkMarks;

// --- CLASSIC STYLED COMPONENTS ---

const RegistryContainer = styled(Box)`
    padding: 40px;
    background-color: #fdfdfd;
    min-height: 100vh;
`;

const HeaderSection = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 15px;
`;

const TypographyClassic = styled(Typography)`
    && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 2px; color: #1a1a1a; }
`;

const TypographySubtitle = styled.p`
    font-family: serif; font-style: italic; color: #7d6b5d; margin: 5px 0 0 0;
`;

const TableWrapper = styled(TableContainer)`
    && {
        border: 1px solid #e0dcd0;
        border-radius: 0;
        & .MuiTableCell-head {
            background-color: #1a1a1a;
            color: white;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 1px;
        }
        & .MuiTableCell-body { font-family: 'serif'; font-size: 0.95rem; }
    }
`;

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 0;
        background-color: white;
        width: 120px;
        & fieldset { border-color: #e0dcd0; }
        &:hover fieldset { border-color: #1a1a1a; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
    }
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    padding: 12px 28px;
    border: none;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 4px 4px 0px #7d6b5d;
    cursor: pointer;
    transition: all 0.2s;
    &:active { transform: translate(2px, 2px); box-shadow: none; }
    &:hover { background-color: #333; }
`;