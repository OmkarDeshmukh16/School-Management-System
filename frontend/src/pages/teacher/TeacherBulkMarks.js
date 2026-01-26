import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { getStudentsByClass } from '../../redux/studentRelated/studentHandle';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

const TeacherBulkMarks = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { studentsList, loading, error } = useSelector((state) => state.student);
    const [marksData, setMarksData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        if (currentUser?.teachSclass?._id) {
            dispatch(getStudentsByClass(currentUser.teachSclass._id, "Student"));
        } else {
            console.error("Teacher has no assigned class (teachSclass) in their profile.");
        }
    }, [dispatch, currentUser?.teachSclass?._id]);

    const maxMarks = 100;

    const submitMarks = async () => {
        // 1. Basic validation check
        if (Object.keys(marksData).length === 0) {
            setMessage("Please enter marks before submitting.");
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
                // Optional: Redirect or refresh data here
            }
        } catch (err) {
            setMessage("Failed to update records. Please try again.");
            setSeverity("error");
            setShowPopup(true);
        }
    };

    const handleMarkChange = (studentID, value) => {
        setMarksData({ ...marksData, [studentID]: value });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Georgia', mb: 2 }}>
                SUBJECT: {currentUser.teachSubject?.subName}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: '#7d6b5d' }}>
                Class: {currentUser.teachSclass?.sclassName}
            </Typography>

            <TableBody>
                {studentsList && studentsList.length > 0 ? (
                    studentsList.map((student) => (
                        <TableRow key={student._id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.rollNum}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    size="small"
                                    onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} align="center">
                            No scholars found for this class. Please verify the Class Registry.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>

            <Button
                variant="contained"
                sx={{ mt: 3, bgcolor: '#1a1a1a', borderRadius: 0 }}
                onClick={submitMarks}
            >
                Submit Academic Ledger
            </Button>
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
                    sx={{ width: '100%', fontFamily: 'Georgia', borderRadius: 0 }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherBulkMarks;