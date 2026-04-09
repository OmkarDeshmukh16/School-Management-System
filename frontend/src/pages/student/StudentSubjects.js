import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography, Box, CircularProgress } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import styled from 'styled-components';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <Box>
            <HeaderSection>
                <ClassicTitle variant="h4">Examination Ledger</ClassicTitle>
                <ClassicSubtitle>Official record of marks obtained across academic disciplines</ClassicSubtitle>
            </HeaderSection>
            <TableWrapper>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject Designation</StyledTableCell>
                            <StyledTableCell align="right">Marks Obtained</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => {
                            if (!result.subName || !result.marksObtained) return null;
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell sx={{ fontFamily: 'serif' }}>{result.subName.subName}</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                                        {result.marksObtained}
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableWrapper>
        </Box>
    );

    const renderChartSection = () => (
        <Box sx={{ p: 4, bgcolor: 'white', border: '1px solid #e0dcd0', boxShadow: '6px 6px 0px #e0dcd0' }}>
            <HeaderSection>
                <ClassicTitle variant="h4">Performance Analytics</ClassicTitle>
                <ClassicSubtitle>Visual distribution of academic achievements</ClassicSubtitle>
            </HeaderSection>
            <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </Box>
    );

    const renderClassDetailsSection = () => (
        <DossierPaper elevation={0}>
            <HeaderSection>
                <ClassicTitle variant="h4">Class Directory</ClassicTitle>
                <ClassicSubtitle>Current enrollment in {sclassDetails?.sclassName || "Academic Group"}</ClassicSubtitle>
            </HeaderSection>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: 'serif', fontStyle: 'italic', mb: 2, color: '#7d6b5d' }}>
                    Registered Curriculum:
                </Typography>
                <GridContainer>
                    {subjectsList?.map((subject, index) => (
                        <SubjectTag key={index}>
                            <Typography variant="body1" sx={{ fontFamily: 'Georgia', fontWeight: 'bold' }}>
                                {subject.subName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#7d6b5d' }}>
                                {subject.subCode}
                            </Typography>
                        </SubjectTag>
                    ))}
                </GridContainer>
            </Box>
        </DossierPaper>
    );

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', pb: 10 }}>
            <Container maxWidth="md" sx={{ pt: 4 }}>
                {loading ? (
                    <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
                ) : (
                    <>
                        {subjectMarks && subjectMarks.length > 0 ? (
                            <>
                                {selectedSection === 'table' && renderTableSection()}
                                {selectedSection === 'chart' && renderChartSection()}

                                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderTop: '1px solid #e0dcd0' }} elevation={0}>
                                    <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels sx={{ height: 70 }}>
                                        <BottomNavigationAction
                                            label="Results Ledger"
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
                            renderClassDetailsSection()
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default StudentSubjects;

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

const DossierPaper = styled(Paper)`
    && {
        padding: 50px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 8px 8px 0px #e0dcd0;
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
        }
    }
`;

const GridContainer = styled(Box)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
`;

const SubjectTag = styled(Box)`
    padding: 15px;
    background-color: #fdfcf8;
    border: 1px solid #eee;
    text-align: center;
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
`;