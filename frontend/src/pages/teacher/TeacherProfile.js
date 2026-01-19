import React from 'react';
import styled from 'styled-components';
import { Typography, Paper, Box, Grid, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { AccountCircle, Email, School, Assignment, Business } from '@mui/icons-material';

const TeacherProfile = () => {
    const { currentUser, response, error } = useSelector((state) => state.user);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const teachSclass = currentUser.teachSclass;
    const teachSubject = currentUser.teachSubject;
    const teachSchool = currentUser.school;

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '80vh', py: 4 }}>
            <Container maxWidth="md">
                <DossierPaper elevation={0}>
                    <HeaderSection>
                        <ClassicTitle variant="h4">Faculty Profile</ClassicTitle>
                        <ClassicSubtitle>Official credentials and institutional assignments</ClassicSubtitle>
                    </HeaderSection>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <InfoRow 
                                icon={<AccountCircle />} 
                                label="Full Legal Name" 
                                value={currentUser.name} 
                            />
                            <InfoRow 
                                icon={<Email />} 
                                label="Institutional Email" 
                                value={currentUser.email} 
                            />
                             <InfoRow 
                                icon={<Business />} 
                                label="Associated Institution" 
                                value={teachSchool?.schoolName} 
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AssignmentBox>
                                <Typography variant="button" sx={{ color: '#1a1a1a', fontWeight: 'bold', mb: 2, display: 'block' }}>
                                    Current Assignments
                                </Typography>
                                <InfoRow 
                                    icon={<School />} 
                                    label="Assigned Class" 
                                    value={teachSclass?.sclassName} 
                                />
                                <InfoRow 
                                    icon={<Assignment />} 
                                    label="Primary Subject" 
                                    value={teachSubject?.subName} 
                                />
                            </AssignmentBox>
                        </Grid>
                    </Grid>
                </DossierPaper>
            </Container>
        </Box>
    );
};

// --- HELPER COMPONENT ---
const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
        <Box sx={{ color: '#7d6b5d', mt: 0.5 }}>{icon}</Box>
        <Box>
            <LabelText>{label}</LabelText>
            <ValueText>{value || 'N/A'}</ValueText>
        </Box>
    </Box>
);

export default TeacherProfile;

// --- CLASSIC STYLED COMPONENTS ---

const DossierPaper = styled(Paper)`
    && {
        padding: 60px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
        position: relative;
        
        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, transparent 50%, #f9f7f2 50%);
            border-bottom: 1px solid #e0dcd0;
            border-left: 1px solid #e0dcd0;
        }
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

const AssignmentBox = styled(Box)`
    padding: 25px;
    background-color: #fdfcf8;
    border: 1px solid #eee;
    height: 100%;
`;