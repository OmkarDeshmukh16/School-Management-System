import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Grid, CircularProgress } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon, Person, Badge, School, Apartment } from '@mui/icons-material';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import styled from 'styled-components';

import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, loading } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const [openStates, setOpenStates] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message] = useState('');
    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('table');

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({ ...prevState, [subId]: !prevState[subId] }));
    };

    const handleChange = (event, newValue) => setValue(newValue);
    const handleSectionChange = (event, newSection) => setSelectedSection(newSection);

    const handleIssueLC = () => {
        // Navigate to the new LC generator path we discussed
        navigate(`/Admin/students/student/lc/${studentID}`);
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")).then(() => dispatch(getUserDetails(studentID, address)));
    };

    const subjectAttendance = userDetails?.attendance || [];
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: 100 - overallAttendancePercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, sessions }]) => ({
        subject: subName,
        attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
    }));
    const chartMarksData = userDetails.examResult?.map(result => ({
        subName: result.subName?.subName || "Unknown",
        marksObtained: result.marksObtained
    })) || [];
    // --- SECTIONS ---

    const StudentDetailsSection = () => (
        <DossierPaper elevation={0}>
            <TypographyClassic variant="h4">Student Information</TypographyClassic>
            <DividerClassic />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <InfoRow icon={<Person />} label="Full Name" value={userDetails.name} />
                    <InfoRow icon={<Badge />} label="Roll Number" value={userDetails.rollNum} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoRow icon={<School />} label="Academic Class" value={userDetails.sclassName?.sclassName} />
                    <InfoRow icon={<Apartment />} label="Institution" value={userDetails.school?.schoolName} />
                </Grid>
            </Grid>

            {subjectAttendance.length > 0 && (
                <Box sx={{ mt: 5, p: 3, border: '1px solid #eee', textAlign: 'center' }}>
                    <Label>Cumulative Attendance Summary</Label>
                    <CustomPieChart data={chartData} />
                </Box>
            )}

        </DossierPaper>
    );

    const StudentAttendanceSection = () => (
        <Box>
            {selectedSection === 'table' ? (
                <TablePaper elevation={0}>
                    <SectionHeader>Attendance Ledger</SectionHeader>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total</StyledTableCell>
                                <StyledTableCell>Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => (
                                <React.Fragment key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>{calculateSubjectAttendancePercentage(present, sessions)}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            </IconButton>
                                            <IconButton onClick={() => removeSubAttendance(subId)}><DeleteIcon color="error" fontSize="small" /></IconButton>
                                            <ClassicSmallButton onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>Modify</ClassicSmallButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2, p: 2, bgcolor: '#fdfcf8', border: '1px solid #eee' }}>
                                                    <Typography variant="button" display="block" gutterBottom>Session History</Typography>
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
                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                </StyledTableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontFamily: 'serif' }}>Overall: {overallAttendancePercentage.toFixed(2)}%</Typography>
                        <Primary3DButton onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>Update Registry</Primary3DButton>
                    </Box>
                </TablePaper>
            ) : (
                <Box sx={{ p: 4, bgcolor: 'white', border: '1px solid #e0dcd0' }}>
                    <SectionHeader>Visual Attendance Distribution</SectionHeader>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </Box>
            )}
            <FixedBottomNav value={selectedSection} onChange={handleSectionChange} />
        </Box>
    );

    const StudentMarksSection = () => (
        <TablePaper elevation={0}>
            <SectionHeader>Examination Results</SectionHeader>
            {selectedSection === 'table' ? (
                <>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject Designation</StyledTableCell>
                                <StyledTableCell>Marks Obtained</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {userDetails.examResult?.map((result, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{result.subName?.subName || "Unassigned Subject"}</StyledTableCell>
                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Primary3DButton onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>Add Mark Entry</Primary3DButton>
                    </Box>
                </>
            ) : (
                <CustomBarChart chartData={chartMarksData} dataKey="marksObtained" />
            )}
            <FixedBottomNav value={selectedSection} onChange={handleSectionChange} />
        </TablePaper>
    );

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh' }}>
            {loading ? (
                <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
            ) : (
                <TabContext value={value}>
                    <FixedTabListContainer>
                        <StyledTabList onChange={handleChange} centered>
                            <StyledTab label="Student Information" value="1" />
                            <StyledTab label="Attendance Registry" value="2" />
                            <StyledTab label="Examination Grades" value="3" />
                        </StyledTabList>
                    </FixedTabListContainer>

                    <Container sx={{ pt: 12, pb: 10 }}>
                        <TabPanel value="1"><StudentDetailsSection /></TabPanel>
                        <TabPanel value="2"><StudentAttendanceSection /></TabPanel>
                        <TabPanel value="3"><StudentMarksSection /></TabPanel>
                    </Container>
                </TabContext>
            )}
            <Primary3DButton onClick={handleIssueLC}>
                Issue Living Certificate
            </Primary3DButton>
            <Primary3DButton
                variant="contained"
                sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                onClick={() => navigate(`/Admin/students/student/bonafide/${params.id}`)}
            >
                Generate Bonafide
            </Primary3DButton>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ViewStudent;

// --- CLASSIC STYLED COMPONENTS ---

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
        <Box sx={{ color: '#7d6b5d', mt: 0.5 }}>{icon}</Box>
        <Box>
            <Label>{label}</Label>
            <Value>{value || 'N/A'}</Value>
        </Box>
    </Box>
);

const FixedTabListContainer = styled(Box)`
    position: fixed; width: 100%; background-color: #ffffff;
    border-bottom: 1px solid #e0dcd0; z-index: 10; top: 64px;
`;

const StyledTabList = styled(TabList)`
    & .MuiTabs-indicator { background-color: #1a1a1a; height: 3px; }
`;

const StyledTab = styled(Tab)`
    && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; color: #7d6b5d;
    &.Mui-selected { color: #1a1a1a; } }
`;

const DossierPaper = styled(Paper)`
    && { padding: 50px; background-color: #ffffff; border: 1px solid #e0dcd0; border-radius: 0; box-shadow: 6px 6px 0px #e0dcd0; }
`;

const TablePaper = styled(Paper)`
    && { padding: 30px; background-color: #ffffff; border: 1px solid #e0dcd0; border-radius: 0; }
`;

const TypographyClassic = styled(Typography)`
    && { font-family: 'Georgia', serif; color: #1a1a1a; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; }
`;

const SectionHeader = styled.h3`
    font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; font-weight: 400; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 10px;
`;

const DividerClassic = styled.div`
    height: 2px; background-color: #1a1a1a; width: 60px; margin: 20px 0 40px 0;
`;

const Label = styled.p`
    font-family: serif; font-size: 0.7rem; text-transform: uppercase; color: #7d6b5d; margin: 0; letter-spacing: 1px; font-weight: 700;
`;

const Value = styled.p`
    font-family: 'Georgia', serif; font-size: 1.2rem; color: #1a1a1a; margin: 2px 0 0 0;
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a; color: white; border: none; padding: 10px 20px; font-family: 'Georgia', serif;
    text-transform: uppercase; letter-spacing: 1px; cursor: pointer; box-shadow: 4px 4px 0px #7d6b5d; transition: all 0.2s;
    &:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #7d6b5d; }
`;

const ClassicSmallButton = styled.button`
    background: none; border: 1px solid #1a1a1a; color: #1a1a1a; padding: 4px 10px; font-family: serif;
    text-transform: uppercase; font-size: 0.65rem; cursor: pointer; &:hover { background-color: #1a1a1a; color: white; }
`;

const FixedBottomNav = ({ value, onChange }) => (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid #e0dcd0' }} elevation={0}>
        <BottomNavigation value={value} onChange={onChange} showLabels sx={{ height: 70 }}>
            <BottomNavigationAction label="Data Ledger" value="table" icon={<TableChartOutlinedIcon />} />
            <BottomNavigationAction label="Analytics" value="chart" icon={<InsertChartOutlinedIcon />} />
        </BottomNavigation>
    </Paper>
);

const LoaderContainer = styled(Box)`
    display: flex; justify-content: center; align-items: center; height: 100vh;
`;