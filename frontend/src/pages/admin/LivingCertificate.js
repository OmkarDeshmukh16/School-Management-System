import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, CircularProgress, Typography, Grid, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import axios from 'axios';

const LivingCertificate = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { id } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFinalized, setIsFinalized] = useState(false);
    const certificateRef = useRef();

    const [exitDetails, setExitDetails] = useState({
        dateOfLeaving: new Date().toISOString().split('T')[0],
        reasonOfLeaving: '',
        remarks: ''
    });

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/Student/${id}`);
                setStudentData(response.data);
                // If data already exists in DB, skip the entry form
                if (response.data.reasonOfLeaving) setIsFinalized(true);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching LC data:", err);
                setLoading(false);
            }
        };
        fetchStudentDetails();
    }, [id]);

    const handleFinalize = async () => {
        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/Student/${id}`, {
                ...exitDetails,
                role: 'Student'
            });
            // Re-fetch or update local state to show the saved data
            setStudentData(prev => ({ ...prev, ...exitDetails }));
            setIsFinalized(true);
            setLoading(false);
        } catch (err) {
            alert("Registry update failed.");
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ ml: 2, fontFamily: 'serif' }}>Retrieving Scholastic Records...</Typography>
        </Box>
    );

    if (!studentData) return <Typography sx={{ textAlign: 'center', mt: 10 }}>Scholar record not found in registry.</Typography>;

    // STEP 1: EXIT DETAILS FORM
    if (!isFinalized) {
        return (
            <Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
                <Paper sx={{ p: 4, border: '1px solid #1a1a1a', boxShadow: '8px 8px 0px #7d6b5d' }}>
                    <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Georgia' }}>De-Enrollment Authorization</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth type="date" label="Official Date of Leaving"
                                InputLabelProps={{ shrink: true }}
                                value={exitDetails.dateOfLeaving}
                                onChange={(e) => setExitDetails({ ...exitDetails, dateOfLeaving: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Reason for Leaving"
                                value={exitDetails.reasonOfLeaving}
                                onChange={(e) => setExitDetails({ ...exitDetails, reasonOfLeaving: e.target.value })}
                                placeholder="e.g., Completed Tenth Grade"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Remarks" multiline rows={2}
                                value={exitDetails.remarks}
                                onChange={(e) => setExitDetails({ ...exitDetails, remarks: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth sx={{ bgcolor: '#1a1a1a', color: 'white' }} onClick={handleFinalize}>
                                Save to Registry & View Certificate
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        );
    }

    // STEP 2: ACTUAL CERTIFICATE VIEW
    return (
        <GeneratorWrapper>
        {/* --- OFFICIAL DOCUMENT PREVIEW --- */}
        <DocumentPaper ref={certificateRef} elevation={0}>
            <DocumentHeader>
                {/* Dynamic School Logo */}
                <LogoBox src={currentUser.schoolLogo || "/default-logo.png"} alt="Institutional Seal" />
                <HeaderInfo>
                    <SchoolName>{currentUser.schoolName || "NEXUS ACADEMY OF EXCELLENCE"}</SchoolName>
                    <SchoolMeta>
                        Affiliation No: 1234567 | School Code: 99.88.777
                    </SchoolMeta>
                    <SchoolAddress>Talegaon Dabhade, Pune, Maharashtra - 410506</SchoolAddress>
                </HeaderInfo>
            </DocumentHeader>

            <TitleSection>
                <Typography variant="h5" sx={{ fontFamily: 'Georgia', fontWeight: 'bold', textDecoration: 'underline' }}>
                    SCHOOL LEAVING CERTIFICATE
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                    (Original Document — Duplicate Copy Prohibited)
                </Typography>
            </TitleSection>

            <DataGrid container spacing={2}>
                {/* Primary Identifiers */}
                <Grid item xs={6}><DataLabel>General Register No:</DataLabel> <DataValue>{studentData.generalRegisterNo}</DataValue></Grid>
                <Grid item xs={6}><DataLabel>UID (Aadhar) No:</DataLabel> <DataValue>{studentData.uid}</DataValue></Grid>
                <Grid item xs={12}><DataLabel>PEN Number:</DataLabel> <DataValue>{studentData.penNumber}</DataValue></Grid>

                {/* Personal Details */}
                <Grid item xs={12}><DataLabel>Full Name of Student:</DataLabel> <DataValue>{studentData.name}</DataValue></Grid>
                <Grid item xs={12}><DataLabel>Mother's Name:</DataLabel> <DataValue>{studentData.motherName}</DataValue></Grid>

                <Grid item xs={6}><DataLabel>Nationality:</DataLabel> <DataValue>{studentData.nationality}</DataValue></Grid>
                <Grid item xs={6}><DataLabel>Mother Tongue:</DataLabel> <DataValue>{studentData.motherTongue}</DataValue></Grid>

                <Grid item xs={4}><DataLabel>Religion:</DataLabel> <DataValue>{studentData.religion}</DataValue></Grid>
                <Grid item xs={4}><DataLabel>Caste:</DataLabel> <DataValue>{studentData.caste}</DataValue></Grid>
                <Grid item xs={4}><DataLabel>Sub-Caste:</DataLabel> <DataValue>{studentData.subCaste}</DataValue></Grid>

                {/* Birth Details */}
                <Grid item xs={12}>
                    <DataLabel>Birthplace:</DataLabel>
                    <DataValue>{studentData.birthPlace}</DataValue>
                </Grid>
                <Grid item xs={12}><DataLabel>Date of Birth:</DataLabel> <DataValue>{studentData.dob}</DataValue></Grid>
                <Grid item xs={12}><DataValue sx={{ pl: 4, fontStyle: 'italic' }}>(In Words): {studentData.birthDateInWords}</DataValue></Grid>

                {/* Academic History */}
                <Grid item xs={12}><DataLabel>Previous School:</DataLabel> <DataValue>{studentData.previousSchoolName} (Std: {studentData.previousSchoolStandard})</DataValue></Grid>
                <Grid item xs={6}><DataLabel>Date of Admission:</DataLabel> <DataValue>{studentData.admissionDate}</DataValue></Grid>
                <Grid item xs={6}><DataLabel>Current Standard:</DataLabel> <DataValue>{studentData.sclassName?.sclassName}</DataValue></Grid>

                {/* Conduct & Exit Details */}
                <Grid item xs={6}><DataLabel>Progress:</DataLabel> <DataValue>{studentData.progress}</DataValue></Grid>
                <Grid item xs={6}><DataLabel>Conduct:</DataLabel> <DataValue>{studentData.conduct}</DataValue></Grid>
                <Grid item xs={12}><DataLabel>Reason for Leaving:</DataLabel> <DataValue>{studentData.reasonOfLeaving}</DataValue></Grid>
                <Grid item xs={6}><DataLabel>Date of Leaving:</DataLabel> <DataValue>{studentData.dateOfLeaving}</DataValue></Grid>
                <Grid item xs={12} sx={{ mt: 2 }}><DataLabel>Remarks:</DataLabel> <DataValue>{studentData.remarks}</DataValue></Grid>
            </DataGrid>

            <SignatureSection>
                <SignBox><Box sx={{ borderTop: '1px solid #000', width: '140px' }} />Class Teaccher</SignBox>
                <SignBox><Box sx={{ borderTop: '1px solid #000', width: '140px' }} />Clerk</SignBox>
                <SignBox><Box sx={{ borderTop: '1px solid #000', width: '140px' }} />Principal & Seal</SignBox>
            </SignatureSection>
        </DocumentPaper>

        <Box sx={{ mt: 4, textAlign: 'right', '@media print': { display: 'none' } }}>
            <Primary3DButton onClick={handlePrint}>Download Official LC</Primary3DButton>
        </Box>
    </GeneratorWrapper>
    );
};

const DocumentPaper = styled(Paper)`
    && {
        padding: 80px;
        border: 2px solid #1a1a1a;
        background-color: #fff;
        font-family: 'Georgia', serif;
        position: relative;
        max-width: 900px;
        margin: auto;
        /* Watermark Effect */
        &::before {
            content: "OFFICIAL RECORD";
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 5rem;
            color: rgba(0,0,0,0.03);
            z-index: 0;
            pointer-events: none;
        }
    }
`;

const DataLabel = styled.span`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.8rem;
    color: #555;
    margin-right: 10px;
`;

const DataValue = styled.span`
    border-bottom: 1px dotted #000;
    font-size: 1rem;
    padding-bottom: 2px;
`;

const DocumentHeader = styled(Box)`
    display: flex;
    align-items: center;
    gap: 30px;
    margin-bottom: 40px;
    border-bottom: 4px double #1a1a1a;
    padding-bottom: 20px;
`;

const SchoolName = styled.h1`
    font-size: 1.8rem;
    margin: 0;
    letter-spacing: 2px;
`;

const SignatureSection = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 80px;
`;

const SignBox = styled.div`
    text-align: center;
    font-size: 0.8rem;
    font-weight: bold;
`;

const GeneratorWrapper = styled.div`
    padding: 24px;
    background-color: #f9f7f2;
    min-height: 100vh;

    @media print {
        padding: 0;
        background-color: white;
        /* Force the certificate to hide everything else in the DOM */
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
    }
`;

/* const GlobalPrintStyle = createGlobalStyle`
  @media print {
    .no-print, 
    nav, 
    header, 
    aside, 
    button,
    .MuiDrawer-root, 
    .MuiAppBar-root {
      display: none !important;
    }
    
    main, .MuiBox-root {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
  }
`; */

const LogoBox = styled.img`
    width: 84px;
    height: 84px;
    object-fit: contain;
`;

const HeaderInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const SchoolMeta = styled.span`
    font-size: 0.85rem;
    color: #333;
`;

const SchoolAddress = styled.span`
    font-size: 0.85rem;
    color: #333;
`;

const TitleSection = styled.div`
    text-align: center;
    margin: 20px 0;
`;

const DataGrid = styled(Grid)`
    && {
        margin-top: 10px;
        z-index: 1;
    }
`;

const Primary3DButton = styled.button`
    background: linear-gradient(145deg,#1e90ff,#0066cc);
    color:#fff;
    padding:10px 16px;
    border:none;
    border-radius:6px;
    box-shadow: 0 6px 0 rgba(0,0,0,0.18);
    cursor:pointer;
    font-weight:600;
    &:active { transform: translateY(2px); box-shadow: 0 4px 0 rgba(0,0,0,0.18); }
`;

export default LivingCertificate;