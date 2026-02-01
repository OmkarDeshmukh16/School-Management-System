import React from 'react'
import styled from 'styled-components';
import { Typography, Grid, Box, Avatar, Container, Paper, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { 
    Badge, School, Email, Phone, Home, Cake, Person, 
    Public, Translate, AutoStories, Gite, LocationOn 
} from '@mui/icons-material';

const StudentProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <DossierPaper elevation={0}>
                    <HeaderSection>
                        <ClassicTitle variant="h4">Scholar Identification</ClassicTitle>
                        <ClassicSubtitle>Official comprehensive record — Restricted Access</ClassicSubtitle>
                    </HeaderSection>

                    <Grid container spacing={6}>
                        {/* LEFT COLUMN: IDENTIFICATION */}
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
                                    <Label>Institutional Status</Label>
                                    <StatusPill>Active Student</StatusPill>
                                    <Divider sx={{ my: 2 }} />
                                    <InfoRow icon={<School />} label="Class" value={currentUser.sclassName?.sclassName} />
                                    <InfoRow icon={<Badge />} label="Roll No." value={currentUser.rollNum} />
                                </Box>
                            </Box>
                        </Grid>

                        {/* RIGHT COLUMN: DETAILED DATA */}
                        <Grid item xs={12} md={8}>
                            {/* SECTION 1: PERSONAL & DEMOGRAPHIC */}
                            <SectionHeading>Demographic Profile</SectionHeading>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Person />} label="Full Name" value={currentUser.name} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Cake />} label="Date of Birth" value={currentUser.dob ? new Date(currentUser.dob).toLocaleDateString() : 'N/A'} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Public />} label="Nationality" value={currentUser.nationality} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Translate />} label="Mother Tongue" value={currentUser.motherTongue} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<AutoStories />} label="Religion" value={currentUser.religion} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<LocationOn />} label="Birth Place" value={currentUser.birthPlace} />
                                </Grid>
                            </Grid>

                            <Divider sx={{ mb: 4 }} />

                            {/* SECTION 2: CASTE & SOCIAL CATEGORY */}
                            <SectionHeading>Social Category Registry</SectionHeading>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Gite />} label="Caste" value={currentUser.caste} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Gite />} label="Sub-Caste" value={currentUser.subCaste} />
                                </Grid>
                            </Grid>

                            <Divider sx={{ mb: 4 }} />

                            {/* SECTION 3: CONTACT & COMMUNICATION */}
                            <SectionHeading>Communication Channels</SectionHeading>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Email />} label="E-Mail" value={currentUser.email} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow icon={<Phone />} label="Mobile Number" value={currentUser.phone} />
                                </Grid>
                                <Grid item xs={12}>
                                    <InfoRow icon={<Home />} label="Residential Address" value={currentUser.address} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DossierPaper>
            </Container>
        </Box>
    )
}

// Helper Row Component
const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'flex-start' }}>
        <Box sx={{ color: '#7d6b5d', mt: 0.5, display: 'flex' }}>{icon}</Box>
        <Box>
            <Label>{label}</Label>
            <Value>{value || 'Not Recorded'}</Value>
        </Box>
    </Box>
);

export default StudentProfile;

// --- STYLED COMPONENTS ---

const DossierPaper = styled(Paper)`
    && {
        padding: 60px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 10px 10px 0px #e0dcd0; /* Classic Tactile Shadow */
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 50px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
`;

const ClassicTitle = styled(Typography)`
    && { font-family: 'Georgia', serif; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; }
`;

const ClassicSubtitle = styled(Typography)`
    && { font-family: serif; font-style: italic; color: #7d6b5d; }
`;

const SectionHeading = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 1.5px;
        color: #1a1a1a;
        margin-bottom: 20px;
        background: #f4f1ea;
        padding: 4px 12px;
        display: inline-block;
    }
`;

const SquareAvatar = styled(Avatar)`
    && {
        width: 180px;
        height: 200px;
        border-radius: 0;
        border: 1px solid #1a1a1a;
        background-color: #fdfcf8;
        color: #1a1a1a;
        font-family: 'Georgia', serif;
        font-size: 5rem;
    }
`;

const Label = styled.p`
    font-family: serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #7d6b5d;
    margin: 0;
    letter-spacing: 1px;
    font-weight: bold;
`;

const Value = styled.p`
    font-family: 'Georgia', serif;
    font-size: 1.05rem;
    color: #1a1a1a;
    margin: 2px 0 0 0;
`;

const StatusPill = styled.span`
    background-color: #1a1a1a;
    color: #ffffff;
    padding: 4px 16px;
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
`;