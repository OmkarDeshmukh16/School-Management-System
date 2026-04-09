import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import styled, { createGlobalStyle } from 'styled-components';
import { getStudentDetail } from '../../redux/studentRelated/studentHandle';

// --- PRINT CONFIGURATION ---
const GlobalPrintStyle = createGlobalStyle`
  @media print {
    @page {
        size: A4 landscape; /* Forces the browser print dialog to Landscape */
        margin: 0;
    }
    body {
        margin: 0;
        padding: 0;
        /* Ensure no other elements interfere with the landscape orientation */
        width: 297mm; 
        height: 210mm;
    }
    /* Strictly hide everything else to avoid orientation confusion */
    nav, aside, header, .no-print, button, .MuiAppBar-root, .MuiDrawer-root {
        display: none !important;
    }
    
    #printable-bonafide {
        visibility: visible;
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        border: 2px solid #000 !important;
        /* Width must match Landscape A4 */
        width: 297mm !important;
        height: 210mm !important;
    }
  }
`;

const BonafideCertificate = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { studentDetails, loading, error } = useSelector((state) => state.student);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getStudentDetail(params.id));
    }, [dispatch, params.id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error loading student data.</Typography>;

    const studentData = studentDetails || {};
    return (
        <GeneratorWrapper>
            <GlobalPrintStyle />

            <DocumentPaper id="printable-bonafide" elevation={0}>
                {/* --- CENTERED HEADER WITH LEFT LOGO --- */}
                <DocumentHeader>
                    <LogoBox src={currentUser.schoolLogo || "/logo-placeholder.png"} alt="School Seal" />
                    <HeaderInfo>
                        <SchoolName>{currentUser.schoolName}</SchoolName>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                            UDISE: {currentUser.udiseNumber} | Board: {currentUser.board}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                            {currentUser.address}
                        </Typography>
                    </HeaderInfo>
                </DocumentHeader>

                {/* --- REFERENCE DETAILS --- */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Typography>No. <b>{studentData.rollNum || "—"}</b></Typography>
                    <Typography>Date: <b>{new Date().toLocaleDateString('en-IN')}</b></Typography>
                </Box>

                <CertificateTitle>BONAFIDE & CHARACTER CERTIFICATE</CertificateTitle>

                {/* --- CONTENT BLOCK --- */}
                <ContentBody>
                    This is to certify that Miss/Mister <b>{studentData.name}</b> 
                     is a bonafide student of this School/College studying in Std.
                    <b> {studentData.sclassName?.sclassName || "—"} </b>
                    of the Academic Year <b> 2025-2026 </b>.
                    <br />
                    His/Her General Register Number of the School is <b> {studentData.rollNum || "—"} </b>.
                    <br />
                    He/She belongs to <b> {studentData.caste} ({studentData.subCaste}) </b>.
                    <br />
                    His/Her date of birth as recorded in the General Register of the School is
                    <b> {studentData.dob ? new Date(studentData.dob).toLocaleDateString('en-IN') : "—"} </b>
                    (In words: <b>{studentData.birthDateInWords || "—"}</b>).
                    <br />
                    To the best of my knowledge, he/she bears <b>good moral character</b>.
                </ContentBody>

                {/* --- SIGNATURE SECTION --- */}
                <SignatureSection>
                    <SignBox><Box sx={{ borderTop: '1px solid #000', width: '200px' }} />Clerk</SignBox>
                    <SignBox><Box sx={{ borderTop: '1px solid #000', width: '200px' }} />Principal & Seal</SignBox>
                </SignatureSection>
            </DocumentPaper>

            <Box className="no-print" sx={{ mt: 4, mb: 4 }}>
                <PrintButton variant="contained" onClick={() => window.print()}>
                    Print Official Certificate
                </PrintButton>
            </Box>
        </GeneratorWrapper>
    );
};

export default BonafideCertificate;

// --- STYLED COMPONENTS ---

const GeneratorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 40px;
`;

const DocumentPaper = styled(Paper)`
    && {
        width: 297mm;  /* A4 Length */
        height: 210mm; /* A4 Width */
        padding: 15mm;
        margin: 20px auto;
        background-color: white;
        border: 2px solid #000 !important;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;

        @media print {
            width: 297mm;
            height: 210mm;
            margin: 0;
            border: 2px solid #000 !important;
        }
    }
`;

const DocumentHeader = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-bottom: 3px double #000;
    padding-bottom: 15px;
    min-height: 110px;
`;

const LogoBox = styled.img`
    position: absolute;
    left: 0;
    top: 0;
    width: 90px;
    height: 90px;
    object-fit: contain;
`;

const HeaderInfo = styled.div`
    width: 100%;
`;

const SchoolName = styled.h1`
    font-family: 'Georgia', serif;
    font-size: 2rem;
    text-transform: uppercase;
    margin: 0;
    font-weight: bold;
    color: #000;
`;

const CertificateTitle = styled.h2`
    text-align: center;
    text-decoration: underline;
    font-weight: bold;
    margin: 30px 0;
    font-family: 'Georgia', serif;
    letter-spacing: 1.5px;
`;

const ContentBody = styled.div`
    margin-top: 20px;
    margin-bottom: 40px;
    padding: 0 20mm; /* Added horizontal padding to prevent text from stretching too wide */
    font-family: 'Times New Roman', serif;
    font-size: 1.4rem; /* Increased font size slightly for landscape */
    line-height: 2;
    text-align: justify;
    color: #000;
`;

const SignatureSection = styled.div`
    margin-top: auto; /* Pushes signatures to the bottom of the landscape page */
    padding-bottom: 10mm;
    display: flex;
    justify-content: space-around; /* Spread out more in landscape */
`;

const SignBox = styled.div`
    text-align: center;
    width: 200px;
`;



const PrintButton = styled(Button)`
    && {
        background-color: #1a1a1a;
        color: white;
        padding: 10px 30px;
        border-radius: 0;
        &:hover { background-color: #333; }
    }
`;