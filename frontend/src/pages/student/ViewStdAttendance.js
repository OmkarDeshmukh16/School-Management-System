import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Collapse, Paper, Table, TableBody, TableHead, Typography, Container, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { present, sessions }]) => ({
        subject: subName,
        attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
    }));

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <Box>
            <HeaderSection>
                <ClassicTitle variant="h4">Attendance Ledger</ClassicTitle>
                <ClassicSubtitle>Formal record of presence and academic engagement</ClassicSubtitle>
            </HeaderSection>
            
            <TableWrapper>
                <Table stickyHeader>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject Designation</StyledTableCell>
                            <StyledTableCell>Present</StyledTableCell>
                            <StyledTableCell>Total Sessions</StyledTableCell>
                            <StyledTableCell>Percentage</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                        const percentage = calculateSubjectAttendancePercentage(present, sessions);
                        return (
                            <TableBody key={index}>
                                <StyledTableRow hover>
                                    <StyledTableCell sx={{ fontFamily: 'serif' }}>{subName}</StyledTableCell>
                                    <StyledTableCell>{present}</StyledTableCell>
                                    <StyledTableCell>{sessions}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{percentage}%</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <ClassicSmallButton onClick={() => handleOpen(subId)}>
                                            {openStates[subId] ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />} View Log
                                        </ClassicSmallButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2, p: 2, bgcolor: '#fdfcf8', border: '1px solid #eee' }}>
                                                <Typography variant="button" display="block" gutterBottom sx={{ color: '#7d6b5d' }}>
                                                    Session History
                                                </Typography>
                                                <Table size="small">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>Date</StyledTableCell>
                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allData.map((data, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{new Date(data.date).toISOString().substring(0, 10)}</StyledTableCell>
                                                                <StyledTableCell align="right" sx={{ color: data.status === 'Present' ? 'inherit' : '#d32f2f' }}>
                                                                    {data.status}
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        );
                    })}
                </Table>
            </TableWrapper>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 2 }}>
                <LabelText>Institutional Standing:</LabelText>
                <ValueText>{overallAttendancePercentage.toFixed(2)}%</ValueText>
            </Box>
        </Box>
    );

    const renderChartSection = () => (
        <Box sx={{ p: 4, bgcolor: 'white', border: '1px solid #e0dcd0', boxShadow: '6px 6px 0px #e0dcd0' }}>
            <HeaderSection>
                <ClassicTitle variant="h4">Visual Analysis</ClassicTitle>
                <ClassicSubtitle>Attendance distribution across academic curriculum</ClassicSubtitle>
            </HeaderSection>
            <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
        </Box>
    );

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', pb: 10 }}>
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                {loading ? (
                    <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
                ) : (
                    <>
                        {subjectAttendance && subjectAttendance.length > 0 ? (
                            <>
                                {selectedSection === 'table' && renderTableSection()}
                                {selectedSection === 'chart' && renderChartSection()}

                                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid #e0dcd0' }} elevation={0}>
                                    <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels sx={{ height: 70 }}>
                                        <BottomNavigationAction
                                            label="Presence Ledger"
                                            value="table"
                                            icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                        />
                                        <BottomNavigationAction
                                            label="Visual Analytics"
                                            value="chart"
                                            icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                        />
                                    </BottomNavigation>
                                </Paper>
                            </>
                        ) : (
                            <EmptyStatePaper elevation={0}>
                                <ClassicTitle variant="h5">Registry Clear</ClassicTitle>
                                <ClassicSubtitle>No attendance records found in the institutional archive.</ClassicSubtitle>
                            </EmptyStatePaper>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default ViewStdAttendance;

// --- CLASSIC STYLED COMPONENTS ---

const HeaderSection = styled(Box)`
    margin-bottom: 35px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 15px;
`;

const ClassicTitle = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 400;
    }
`;

const ClassicSubtitle = styled(Typography)`
    && {
        font-family: serif;
        font-style: italic;
        color: #7d6b5d;
        font-size: 0.9rem;
    }
`;

const TableWrapper = styled(Paper)`
    && {
        border-radius: 0;
        border: 1px solid #e0dcd0;
        box-shadow: 6px 6px 0px #e0dcd0;
        & .MuiTableCell-head {
            background-color: #1a1a1a;
            color: white;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.8rem;
        }
    }
`;

const ClassicSmallButton = styled.button`
    background: none;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 6px 12px;
    font-family: serif;
    text-transform: uppercase;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0 auto;
    &:hover { background-color: #f9f7f2; }
`;

const LabelText = styled.p`
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #7d6b5d;
    margin: 0;
    letter-spacing: 1px;
    font-weight: 700;
`;

const ValueText = styled.p`
    font-family: 'Georgia', serif;
    font-size: 2.2rem;
    color: #1a1a1a;
    margin: 0;
`;

const EmptyStatePaper = styled(Paper)`
    && {
        padding: 80px;
        text-align: center;
        background-color: #ffffff;
        border: 1px dashed #e0dcd0;
        border-radius: 0;
    }
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
`;