import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { Person, School, Assignment, EventNote } from '@mui/icons-material';
import styled from 'styled-components';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', py: 8 }}>
            {loading ? (
                <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
            ) : (
                <Container maxWidth="md">
                    <DossierPaper elevation={0}>
                        <HeaderSection>
                            <ClassicTitle variant="h4">Faculty Dossier</ClassicTitle>
                            <ClassicSubtitle>Official personnel record and academic assignments</ClassicSubtitle>
                        </HeaderSection>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <InfoRow 
                                    icon={<Person />} 
                                    label="Full Legal Name" 
                                    value={teacherDetails?.name} 
                                />
                                <InfoRow 
                                    icon={<School />} 
                                    label="Assigned Class" 
                                    value={teacherDetails?.teachSclass?.sclassName} 
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {isSubjectNamePresent ? (
                                    <>
                                        <InfoRow 
                                            icon={<Assignment />} 
                                            label="Academic Subject" 
                                            value={teacherDetails?.teachSubject?.subName} 
                                        />
                                        <InfoRow 
                                            icon={<EventNote />} 
                                            label="Subject Sessions" 
                                            value={teacherDetails?.teachSubject?.sessions} 
                                        />
                                    </>
                                ) : (
                                    <Box sx={{ p: 2, border: '1px dashed #7d6b5d', textAlign: 'center' }}>
                                        <Label sx={{ mb: 1 }}>Subject Assignment Pending</Label>
                                        <Primary3DButton onClick={handleAddSubject}>
                                            Assign Discipline
                                        </Primary3DButton>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #eee', display: 'flex', gap: 2 }}>
                            <ClassicSmallButton onClick={() => navigate(-1)}>
                                Return to Registry
                            </ClassicSmallButton>
                        </Box>
                    </DossierPaper>
                </Container>
            )}
        </Box>
    );
};

export default TeacherDetails;

// --- CLASSIC STYLED COMPONENTS ---

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
        <Box sx={{ color: '#7d6b5d', mt: 0.5 }}>{icon}</Box>
        <Box>
            <Label>{label}</Label>
            <Value>{value || 'Not Assigned'}</Value>
        </Box>
    </Box>
);

const DossierPaper = styled(Paper)`
    && {
        padding: 60px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
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

const Label = styled.p`
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #7d6b5d;
    margin: 0;
    letter-spacing: 1px;
    font-weight: 700;
`;

const Value = styled.p`
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    color: #1a1a1a;
    margin: 2px 0 0 0;
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    border: none;
    padding: 10px 20px;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #7d6b5d;
    transition: all 0.2s;

    &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px #7d6b5d;
    }
    &:active {
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0px #7d6b5d;
    }
`;

const ClassicSmallButton = styled.button`
    background: none;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 8px 16px;
    font-family: serif;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1px;
    cursor: pointer;

    &:hover {
        background-color: #1a1a1a;
        color: white;
    }
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    color: #1a1a1a;
`;