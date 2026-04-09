import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper, Grid, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';

const ViewSubject = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { subloading, subjectDetails, sclassStudents, getresponse } = useSelector((state) => state.sclass);

    const { classID, subjectID } = params

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => setValue(newValue);

    const [selectedSection, setSelectedSection] = useState('attendance');
    const handleSectionChange = (event, newSection) => setSelectedSection(newSection);

    const studentColumns = [
        { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
        { id: 'name', label: 'Scholar Name', minWidth: 170 },
    ]

    const studentRows = sclassStudents.map((student) => ({
        rollNum: student.rollNum,
        name: student.name,
        id: student._id,
    }));

    const StudentsAttendanceButtonHaver = ({ row }) => (
        <ActionStack>
            <ClassicSmallButton onClick={() => navigate("/Admin/students/student/" + row.id)}>
                View File
            </ClassicSmallButton>
            <Primary3DButton onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}>
                Take Attendance
            </Primary3DButton>
        </ActionStack>
    );

    const StudentsMarksButtonHaver = ({ row }) => (
        <ActionStack>
            <ClassicSmallButton onClick={() => navigate("/Admin/students/student/" + row.id)}>
                View File
            </ClassicSmallButton>
            <Primary3DButton onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
                Provide Marks
            </Primary3DButton>
        </ActionStack>
    );

    const SubjectStudentsSection = () => (
        <Box>
            {getresponse ? (
                <EmptyState>
                    <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>No scholars currently enrolled in this class.</Typography>
                    <Classic3DButton onClick={() => navigate("/Admin/class/addstudents/" + classID)}>
                        Enroll Students
                    </Classic3DButton>
                </EmptyState>
            ) : (
                <TablePaper elevation={0}>
                    <SectionHeader>Enrolled Scholars Registry</SectionHeader>
                    {selectedSection === 'attendance' &&
                        <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
                    }
                    {selectedSection === 'marks' &&
                        <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
                    }

                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid #e0dcd0' }} elevation={0}>
                        <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels sx={{ height: 70 }}>
                            <BottomNavigationAction
                                label="Attendance Ledger"
                                value="attendance"
                                icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                            />
                            <BottomNavigationAction
                                label="Grade Entries"
                                value="marks"
                                icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                            />
                        </BottomNavigation>
                    </Paper>
                </TablePaper>
            )}
        </Box>
    );

    const SubjectDetailsSection = () => (
        <DossierPaper elevation={0}>
            <TypographyClassic variant="h4">Subject Report</TypographyClassic>
            <DividerClassic />
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <InfoRow icon={<AssignmentIcon />} label="Subject Designation" value={subjectDetails?.subName} />
                    <InfoRow icon={<ClassIcon />} label="Course Code" value={subjectDetails?.subCode} />
                    <InfoRow icon={<SchoolIcon />} label="Academic Sessions" value={subjectDetails?.sessions} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoRow icon={<ClassIcon />} label="Class" value={subjectDetails?.sclassName?.sclassName} />
                    <InfoRow icon={<PersonIcon />} label="Assigned Faculty" value={subjectDetails?.teacher?.name || "Unassigned"} />
                    <Box sx={{ mt: 2 }}>
                        {!subjectDetails?.teacher && (
                            <Classic3DButton onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails?._id)}>
                                Appoint Faculty
                            </Classic3DButton>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </DossierPaper>
    );

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh' }}>
            {subloading ? (
                <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
            ) : (
                <TabContext value={value}>
                    <FixedTabListContainer>
                        <StyledTabList onChange={handleChange} centered>
                            <StyledTab label="Curriculum Details" value="1" />
                            <StyledTab label="Scholar Management" value="2" />
                        </StyledTabList>
                    </FixedTabListContainer>

                    <Container sx={{ pt: 12, pb: 10 }}>
                        <TabPanel value="1"><SubjectDetailsSection /></TabPanel>
                        <TabPanel value="2"><SubjectStudentsSection /></TabPanel>
                    </Container>
                </TabContext>
            )}
        </Box>
    );
}

export default ViewSubject;

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
    && { padding: 30px; background-color: #ffffff; border: 1px solid #e0dcd0; border-radius: 0; 
        & .MuiTableCell-head { background-color: #1a1a1a; color: white; font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; }
    }
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
    background-color: #1a1a1a; color: white; border: none; padding: 6px 14px; font-family: 'Georgia', serif;
    text-transform: uppercase; letter-spacing: 1px; cursor: pointer; box-shadow: 3px 3px 0px #7d6b5d; transition: all 0.2s;
    font-size: 0.7rem;
    &:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0px #7d6b5d; }
`;

const Classic3DButton = styled.button`
    background-color: #1a1a1a; color: white; border: none; padding: 12px 24px; font-family: 'Georgia', serif;
    text-transform: uppercase; letter-spacing: 1px; cursor: pointer; box-shadow: 4px 4px 0px #7d6b5d; transition: all 0.2s;
    &:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #7d6b5d; }
`;

const ClassicSmallButton = styled.button`
    background: none; border: 1px solid #1a1a1a; color: #1a1a1a; padding: 6px 12px; font-family: serif;
    text-transform: uppercase; font-size: 0.7rem; cursor: pointer; &:hover { background-color: #f9f7f2; }
`;

const ActionStack = styled.div`
    display: flex; gap: 10px; justify-content: center;
`;

const EmptyState = styled(Box)`
    text-align: center; padding: 60px; border: 1px dashed #e0dcd0; background-color: #fdfcf8;
`;

const LoaderContainer = styled(Box)`
    display: flex; justify-content: center; align-items: center; height: 80vh;
`;