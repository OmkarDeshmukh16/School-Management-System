import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, CircularProgress, Typography, Grid, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { createGlobalStyle } from 'styled-components';


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

            <PrintConfig />
            {/* --- OFFICIAL DOCUMENT PREVIEW --- */}
            <DocumentPaper id="printable-certificate" ref={certificateRef} elevation={0}>
                <DocumentHeader>
                    {/* Pulls logo from Admin Profile */}
                    <LogoBox
                        src={currentUser.schoolLogo || "/default-logo.png"}
                        alt="Institutional Seal"
                    />
                    <HeaderInfo>
                        {/* Dynamic Institutional Data */}
                        <SchoolName>{currentUser.schoolName || "INSTITUTION NAME"}</SchoolName>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', mt: 1 }}>
                            UDISE: {currentUser.udiseNumber} | Board: {currentUser.board} | Medium: {currentUser.medium}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                            {currentUser.address}
                        </Typography>                    </HeaderInfo>
                </DocumentHeader>

                <TitleSection>
                    <Typography variant="h5" sx={{ fontFamily: 'Georgia', fontWeight: 'bold', textDecoration: 'underline' }}>
                        SCHOOL LEAVING CERTIFICATE
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
                        <DataValue>
                            {/* Combines individual fields for a full legal address */}
                            {studentData.village}, {studentData.taluka}, {studentData.district}
                        </DataValue>
                    </Grid>
                    <Grid item xs={12}>
                        <DataLabel>Date of Birth:</DataLabel>
                        <DataValue>
                            {/* Formats 2026-02-01T... into 01/02/2026 */}
                            {studentData.dob ? new Date(studentData.dob).toLocaleDateString('en-IN') : "—"}
                        </DataValue>
                    </Grid>
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
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                    (Note: No change in any certificate shall be made except by the authority issuing it and any infringement of this requirement is liable to involve the imposition of penalty such as rustication.)
                </Typography>
            </DocumentPaper>

            <Box sx={{ mt: 4, textAlign: 'right', '@media print': { display: 'none' } }}>
                <Primary3DButton onClick={handlePrint}>Download Official LC</Primary3DButton>
            </Box>
        </GeneratorWrapper>
    );
};

/* const CertificateTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-family: 'Times New Roman', serif;
    
    td {
        border: 1px solid #000;
        padding: 10px;
        font-size: 0.95rem;
        line-height: 1.4;
    }
`; */

const PrintConfig = createGlobalStyle`
  @media print {
    /* 1. Hide the Sidebar, Dashboard Header, and system text */
    nav, 
    aside, 
    header, 
    .no-print,
    .MuiDrawer-root, 
    .MuiAppBar-root,
    button {
      display: none !important;
    }

    /* 2. Reset margins and backgrounds for a clean white sheet */
    body {
      background-color: white !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* 3. Ensure the certificate container takes full width and height */
    main, .MuiBox-root {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
  }
`;

const DocumentPaper = styled(Paper)`
    && {
        width: 210mm;
        height: 297mm;
        padding: 15mm;
        background-color: white;
        border: 2px solid #000 !important;
        box-shadow: 0 0 0 2px #000;
        box-sizing: border-box;
        margin: auto;
        position: relative;
        overflow: hidden;

        @media print {
            border: 2px solid #000 !important;

            width: 100%;
            height: 100%;
            margin-top: 1mm !important;
            margin-left: auto;
            margin-right: auto;

            /* High-accuracy print rendering */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }
`;

const DocumentHeader = styled.div`
    position: relative; /* Essential for absolute logo positioning */
    display: flex;
    flex-direction: column;
    align-items: center; /* Centers the child HeaderInfo */
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px double #000;
    min-height: 120px; /* Ensures space for the logo */
`;

const LogoBox = styled.img`
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    object-fit: contain;
`;

const HeaderInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SchoolName = styled.h3`
    font-family: 'Georgia', serif;
    font-size: 1.5rem;
    text-transform: uppercase;
    margin: 0;
    padding: 0;
    width: 80%; /* Limits width so it doesn't overlap logo if very long */
    font-weight: bold;
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

const SignatureSection = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
    .sign-line {
        border-top: 1px solid #000;
        width: 150px;
        margin-bottom: 5px;
    }
`;

const SignBox = styled.div`
    text-align: center;
    font-size: 0.8rem;
    font-weight: bold;
`;

const GeneratorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
    min-height: 100vh;

    @media print {
        padding: 0;
        background-color: white;
    }
`;

const GlobalPrintStyle = createGlobalStyle`
  @media print {
    /* 1. Hide everything except the certificate */
    body * {
        visibility: hidden;
    }
    #printable-certificate, #printable-certificate * {
        visibility: visible;
    }
    
    /* 2. Position the certificate at the absolute top-left */
    #printable-certificate {
        position: absolute;
        left: 0;
        top: 0;
        visibility: visible;
    }

    /* 3. Hide browser headers/footers (URL, Date) */
    @page {
        size: auto;
        margin: 0; /* Small margin to prevent printer clipping */
    }

    /* 4. Force hide the sidebar and top-nav specifically */
    nav, aside, header, .no-print, [class*="MuiDrawer"], [class*="MuiAppBar"] {
        display: none !important;
    }
  }
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