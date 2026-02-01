import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Collapse, Table, TableBody, TableHead, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Person, Badge, School, Apartment } from '@mui/icons-material';
import styled from 'styled-components';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading, error } = useSelector((state) => state.user);

    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, "Student"));
    }, [dispatch, studentID]);

    const [openStates, setOpenStates] = useState({});
    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({ ...prevState, [subId]: !prevState[subId] }));
    };

    const subjectAttendance = userDetails?.attendance || [];
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: 100 - overallAttendancePercentage }
    ];

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', py: 4 }}>
            {loading ? (
                <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
            ) : (
                <Container maxWidth="lg">
                    <DossierPaper elevation={0}>
                        <HeaderSection>
                            <ClassicTitle variant="h4">Student Information</ClassicTitle>
                            <ClassicSubtitle>Comprehensive academic performance and presence record</ClassicSubtitle>
                        </HeaderSection>

                        {/* Scholar Identification */}
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            <Grid item xs={12} md={6}>
                                <InfoRow icon={<Person />} label="Full Name" value={userDetails?.name} />
                                <InfoRow icon={<Badge />} label="Roll Number" value={userDetails?.rollNum} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoRow icon={<School />} label="Academic Class" value={userDetails?.sclassName?.sclassName} />
                                <InfoRow icon={<Apartment />} label="Institution" value={userDetails?.school?.schoolName} />
                            </Grid>
                        </Grid>

                        <DividerClassic />

                        {/* Subject Specific Data */}
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={7}>
                                <SectionHeading>Subject Attendance: {teachSubject}</SectionHeading>
                                {subjectAttendance.length > 0 ? (
                                    Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                        if (subName === teachSubject) {
                                            const percentage = calculateSubjectAttendancePercentage(present, sessions);
                                            return (
                                                <Box key={index} sx={{ mb: 4 }}>
                                                    <TableWrapper>
                                                        <Table size="small">
                                                            <TableHead sx={{ bgcolor: '#1a1a1a' }}>
                                                                <StyledTableRow>
                                                                    <StyledTableCell sx={{ color: 'white' }}>Present</StyledTableCell>
                                                                    <StyledTableCell sx={{ color: 'white' }}>Total</StyledTableCell>
                                                                    <StyledTableCell sx={{ color: 'white' }}>Percentage</StyledTableCell>
                                                                    <StyledTableCell sx={{ color: 'white' }} align="center">History</StyledTableCell>
                                                                </StyledTableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <StyledTableRow>
                                                                    <StyledTableCell>{present}</StyledTableCell>
                                                                    <StyledTableCell>{sessions}</StyledTableCell>
                                                                    <StyledTableCell>{percentage}%</StyledTableCell>
                                                                    <StyledTableCell align="center">
                                                                        <ClassicSmallButton onClick={() => handleOpen(subId)}>
                                                                            {openStates[subId] ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />} Log
                                                                        </ClassicSmallButton>
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                                <StyledTableRow>
                                                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                                                        <Collapse in={openStates[subId]} timeout="auto">
                                                                            <Box sx={{ p: 2, bgcolor: '#fdfcf8' }}>
                                                                                <Table size="small">
                                                                                    <TableHead><StyledTableRow><StyledTableCell>Date</StyledTableCell><StyledTableCell align="right">Status</StyledTableCell></StyledTableRow></TableHead>
                                                                                    <TableBody>
                                                                                        {allData.map((data, i) => (
                                                                                            <StyledTableRow key={i}>
                                                                                                <StyledTableCell>{new Date(data.date).toISOString().substring(0, 10)}</StyledTableCell>
                                                                                                <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                                            </StyledTableRow>
                                                                                        ))}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </Box>
                                                                        </Collapse>
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableWrapper>
                                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                        <Primary3DButton onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}>
                                                            Update Attendance
                                                        </Primary3DButton>
                                                    </Box>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <EmptyStateText>No attendance data recorded for this discipline.</EmptyStateText>
                                )}

                                <SectionHeading sx={{ mt: 5 }}>Examination Grades</SectionHeading>
                                {userDetails?.examResult?.some(r => r.subName.subName === teachSubject) ? (
                                    userDetails.examResult.map((result, index) => {
                                        if (result.subName.subName === teachSubject) {
                                            return (
                                                <Box key={index}>
                                                    <TableWrapper>
                                                        <Table size="small">
                                                            <TableHead sx={{ bgcolor: '#1a1a1a' }}><StyledTableRow><StyledTableCell sx={{ color: 'white' }}>Subject</StyledTableCell><StyledTableCell sx={{ color: 'white' }}>Marks Obtained</StyledTableCell></StyledTableRow></TableHead>
                                                            <TableBody><StyledTableRow><StyledTableCell>{result.subName.subName}</StyledTableCell><StyledTableCell>{result.marksObtained}</StyledTableCell></StyledTableRow></TableBody>
                                                        </Table>
                                                    </TableWrapper>
                                                    <Box sx={{ mt: 2 }}>
                                                        <Primary3DButton onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}>
                                                            Modify Grade
                                                        </Primary3DButton>
                                                    </Box>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <Box sx={{ mt: 2 }}>
                                        <Primary3DButton onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}>
                                            Authorize New Mark Entry
                                        </Primary3DButton>
                                    </Box>
                                )}
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <AnalyticsBox>
                                    <Typography variant="button" sx={{ color: '#7d6b5d', fontWeight: 'bold', mb: 3, display: 'block', textAlign: 'center' }}>
                                        Global Attendance Summary
                                    </Typography>
                                    <CustomPieChart data={chartData} />
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <LabelText>Institutional Standing</LabelText>
                                        <ValueText sx={{ fontSize: '1.5rem' }}>{overallAttendancePercentage.toFixed(2)}%</ValueText>
                                    </Box>
                                </AnalyticsBox>
                            </Grid>
                        </Grid>
                    </DossierPaper>
                </Container>
            )}
        </Box>
    );
};

// --- CLASSIC STYLED COMPONENTS ---

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
        <Box sx={{ color: '#7d6b5d', mt: 0.5 }}>{icon}</Box>
        <Box>
            <LabelText>{label}</LabelText>
            <ValueText>{value || 'N/A'}</ValueText>
        </Box>
    </Box>
);

const DossierPaper = styled(Paper)`
    && {
        padding: 60px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 8px 8px 0px #e0dcd0;
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 45px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
`;

const ClassicTitle = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 400;
    }
`;

const ClassicSubtitle = styled(Typography)`
    && {
        font-family: serif;
        font-style: italic;
        color: #7d6b5d;
        font-size: 0.95rem;
        margin-top: 8px;
    }
`;

const SectionHeading = styled.h3`
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    font-size: 1.1rem;
    letter-spacing: 1px;
    margin-bottom: 20px;
    color: #1a1a1a;
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
    font-size: 1.2rem;
    color: #1a1a1a;
    margin: 2px 0 0 0;
`;

const DividerClassic = styled.div`
    height: 1px;
    background-color: #eee;
    width: 100%;
    margin: 40px 0;
`;

const TableWrapper = styled(Box)`
    border: 1px solid #e0dcd0;
    & .MuiTableCell-root {
        font-family: 'serif';
    }
`;

const AnalyticsBox = styled(Box)`
    padding: 30px;
    background-color: #fdfcf8;
    border: 1px solid #eee;
    height: 100%;
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    border: none;
    padding: 10px 18px;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #7d6b5d;
    transition: all 0.2s;
    &:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #7d6b5d; }
`;

const ClassicSmallButton = styled.button`
    background: none;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 4px 10px;
    font-family: serif;
    text-transform: uppercase;
    font-size: 0.65rem;
    cursor: pointer;
    &:hover { background-color: #1a1a1a; color: white; }
`;

const EmptyStateText = styled.p`
    font-family: serif;
    font-style: italic;
    color: #999;
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
`;

export default TeacherViewStudent;