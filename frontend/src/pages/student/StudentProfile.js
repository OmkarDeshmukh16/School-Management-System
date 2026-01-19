import React from 'react'
import styled from 'styled-components';
import { Typography, Grid, Box, Avatar, Container, Paper, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { Badge, School, Email, Phone, Home, FamilyRestroom, Cake, Person } from '@mui/icons-material';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  return (
    <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <DossierPaper elevation={0}>
          <HeaderSection>
            <ClassicTitle variant="h4">Scholar Identification Dossier</ClassicTitle>
            <ClassicSubtitle>Official academic personnel record — Confidential</ClassicSubtitle>
          </HeaderSection>

          <Grid container spacing={4}>
            {/* Left Column: Photo & Primary ID */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <SquareAvatar variant="square">
                  {String(currentUser.name).charAt(0)}
                </SquareAvatar>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Label>Institutional Status</Label>
                  <StatusPill>Active Student</StatusPill>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Key Details */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InfoRow icon={<Person />} label="Full Scholar Name" value={currentUser.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoRow icon={<Badge />} label="Enrollment Roll No." value={currentUser.rollNum} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoRow icon={<School />} label="Academic Cohort" value={sclassName.sclassName} />
                </Grid>
                <Grid item xs={12}>
                  <InfoRow icon={<School />} label="Affiliated Institution" value={studentSchool.schoolName} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <DividerClassic />

          {/* Personal Information Section */}
          <SectionHeading variant="h6">Personnel Information</SectionHeading>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<Cake />} label="Date of Birth" value="January 1, 2000" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<Person />} label="Gender Designation" value="Male" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<Email />} label="Contact Dispatch" value="scholar.record@institution.edu" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<Phone />} label="Verified Phone" value="(+91) 98765-43210" />
            </Grid>
            <Grid item xs={12}>
              <InfoRow icon={<Home />} label="Residential Address" value="123 Academic Row, Knowledge Park, Maharashtra" />
            </Grid>
            <Grid item xs={12}>
              <InfoRow icon={<FamilyRestroom />} label="Emergency Contact" value="Parental Registry: (+91) 12345-67890" />
            </Grid>
          </Grid>
        </DossierPaper>
      </Container>
    </Box>
  )
}

// --- HELPER COMPONENT ---
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'flex-start' }}>
    <Box sx={{ color: '#7d6b5d', mt: 0.5 }}>{icon}</Box>
    <Box>
      <Label>{label}</Label>
      <Value>{value || 'N/A'}</Value>
    </Box>
  </Box>
);

export default StudentProfile

// --- CLASSIC STYLED COMPONENTS ---

const DossierPaper = styled(Paper)`
  && {
    padding: 60px;
    background-color: #ffffff;
    border: 1px solid #e0dcd0;
    border-radius: 0;
    box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
    position: relative;
    overflow: hidden;

    &::before {
      content: "CONFIDENTIAL";
      position: absolute;
      top: 40px;
      right: -40px;
      transform: rotate(45deg);
      background-color: #f4f1ea;
      color: #7d6b5d;
      font-family: serif;
      font-size: 0.7rem;
      padding: 5px 40px;
      letter-spacing: 2px;
    }
  }
`;

const HeaderSection = styled(Box)`
  margin-bottom: 40px;
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
    font-size: 0.9rem;
    margin-top: 5px;
  }
`;

const SquareAvatar = styled(Avatar)`
  && {
    width: 160px;
    height: 180px;
    border-radius: 0;
    border: 1px solid #1a1a1a;
    background-color: #f4f1ea;
    color: #1a1a1a;
    font-family: 'Georgia', serif;
    font-size: 4rem;
  }
`;

const Label = styled.p`
  font-family: serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #7d6b5d;
  margin: 0;
  letter-spacing: 1px;
  font-weight: 700;
`;

const Value = styled.p`
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 2px 0 0 0;
`;

const SectionHeading = styled(Typography)`
  && {
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
    color: #1a1a1a;
    font-size: 1rem;
  }
`;

const DividerClassic = styled.div`
  height: 1px;
  background-color: #eee;
  width: 100%;
  margin: 40px 0;
`;

const StatusPill = styled.span`
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 4px 12px;
  font-family: serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;