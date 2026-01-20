import React, { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Container, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BulkEnrollment = () => {
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    
    // Get institutional data from Redux
    const { currentUser } = useSelector(state => state.user);
    const schoolID = currentUser._id;

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('excelFile', file);
        formData.append('school', schoolID);
        // Note: You can also pass a specific classID here if needed

        setLoader(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/BulkStudentReg`, formData);
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Failed to sync registry. Ensure headers are: Name, RollNum, Password.");
        }
        setLoader(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <DossierPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Institutional Registry Upload</ClassicTitle>
                    <ClassicSubtitle>Authorize mass scholar enrollment via Excel ledger</ClassicSubtitle>
                </HeaderSection>

                <Stack spacing={4} alignItems="center">
                    <UploadZone>
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#7d6b5d', mb: 2 }} />
                        <Typography sx={{ fontFamily: 'serif', mb: 2 }}>
                            Select the formatted .xlsx or .xls enrollment ledger
                        </Typography>
                        
                        <input 
                            type="file" 
                            accept=".xlsx, .xls" 
                            onChange={handleFileChange} 
                            id="excel-upload" 
                            style={{ display: 'none' }} 
                        />
                        <label htmlFor="excel-upload">
                            <ClassicOutlineButton as="span">Browse Files</ClassicOutlineButton>
                        </label>
                        
                        {file && (
                            <Typography sx={{ mt: 2, fontStyle: 'italic', fontWeight: 'bold' }}>
                                File Selected: {file.name}
                            </Typography>
                        )}
                    </UploadZone>

                    <Primary3DButton onClick={handleUpload} disabled={loader || !file}>
                        {loader ? <CircularProgress size={24} color="inherit" /> : "Authorize Mass Enrollment"}
                    </Primary3DButton>
                    
                    {message && <StatusNote>{message}</StatusNote>}
                </Stack>
            </DossierPaper>
        </Container>
    );
};

export default BulkEnrollment;

// --- CLASSIC STYLED COMPONENTS ---

const DossierPaper = styled(Paper)`
    && {
        padding: 60px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        box-shadow: 8px 8px 0px #e0dcd0;
        border-radius: 0;
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    width: 100%;
`;

const ClassicTitle = styled(Typography)`
    && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; color: #1a1a1a; }
`;

const ClassicSubtitle = styled(Typography)`
    && { font-family: serif; font-style: italic; color: #7d6b5d; font-size: 0.95rem; }
`;

const UploadZone = styled(Box)`
    width: 100%;
    padding: 40px;
    border: 2px dashed #e0dcd0;
    background-color: #fdfcf8;
    text-align: center;
    transition: all 0.3s ease;
    &:hover { border-color: #1a1a1a; }
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    padding: 14px 40px;
    border: none;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    box-shadow: 4px 4px 0px #7d6b5d;
    cursor: pointer;
    &:disabled { background-color: #ccc; box-shadow: none; }
`;

const ClassicOutlineButton = styled.button`
    background: none; border: 1px solid #1a1a1a; color: #1a1a1a; padding: 8px 20px;
    font-family: serif; text-transform: uppercase; font-size: 0.8rem; cursor: pointer;
`;

const StatusNote = styled.p`
    font-family: serif; font-style: italic; color: #1a1a1a; margin-top: 20px;
`;