import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import { getStudentsByClass } from '../../redux/studentRelated/studentHandle';
import axios from 'axios';
import { BASEURL } from '../../utils/apiConfig';
import styled from 'styled-components';

const TeacherBulkAttendance = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { studentsList } = useSelector((state) => state.student);

    // Initializing all students as present by default
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const totalStudents = studentsList?.length || 0;
    const absentCount = Object.values(attendanceStatus).filter(status => status === false).length;
    const presentCount = totalStudents - absentCount;

    useEffect(() => {
        if (currentUser?.teachSclass?._id) {
            dispatch(getStudentsByClass(currentUser.teachSclass._id));
        }
    }, [dispatch, currentUser?.teachSclass?._id]);

    const handleCheckboxChange = (studentId) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const submitAttendance = async () => {
        const formattedData = studentsList.map(student => ({
            studentId: student._id,
            status: attendanceStatus[student._id] === false ? "Absent" : "Present"
        }));

        try {
            await axios.put(`${BASEURL}/UpdateBulkAttendance`, {
                attendanceData: formattedData,
                date: selectedDate,
                subId: currentUser.teachSubject._id
            });
            alert(`Attendance for ${selectedDate} synchronized successfully.`);
        } catch (err) {
            alert("Failed to sync attendance registry.");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Georgia', textTransform: 'uppercase' }}>
                        Attendance Registry
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#7d6b5d' }}>
                        Subject: {currentUser.teachSubject?.subName} | Class: {currentUser.teachSclass?.sclassName}
                    </Typography>
                </Box>

                {/* Date Picker Input */}
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>SELECT SESSION DATE</Typography>
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        sx={{ bgcolor: 'white' }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0dcd0', borderRadius: 0 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a1a1a' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontFamily: 'serif' }}>Scholar Name</TableCell>
                            <TableCell sx={{ color: 'white', fontFamily: 'serif' }}>Roll No.</TableCell>
                            <TableCell sx={{ color: 'white', fontFamily: 'serif' }} align="center">Mark Present</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentsList && studentsList.map((student) => (
                            <TableRow key={student._id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fdfcf8' } }}>
                                <TableCell sx={{ fontFamily: 'serif' }}>{student.name}</TableCell>
                                <TableCell sx={{ fontFamily: 'serif' }}>{student.rollNum}</TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        defaultChecked
                                        sx={{ color: '#1a1a1a', '&.Mui-checked': { color: '#2e7d32' } }}
                                        onChange={() => handleCheckboxChange(student._id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontFamily: 'serif', fontWeight: 'bold' }}>TOTAL SCHOLARS: {totalStudents}</TableCell>
                        <TableCell sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#2e7d32' }}>PRESENT: {presentCount}</TableCell>
                        <TableCell sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#d32f2f' }} align="center">ABSENT: {absentCount}</TableCell>
                    </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Primary3DButton onClick={submitAttendance}>
                    Authorize Daily Registry
                </Primary3DButton>
            </Box>
        </Box>
    );
};

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    padding: 12px 24px;
    border: none;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 4px 4px 0px #7d6b5d;
    cursor: pointer;
    &:active { transform: translate(2px, 2px); box-shadow: none; }
`;

export default TeacherBulkAttendance;