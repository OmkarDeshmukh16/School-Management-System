import React, { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Container, Stack, Select, MenuItem, FormControl } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASEURL } from '../../../utils/apiConfig';
import styled from 'styled-components';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { downloadScholarTemplate } from '../../../utils/excelTemplate';

const BulkEnrollment = () => {
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    // Ensure 'sclass' matches the name of the reducer in your store.js
    const { sclassesList, loading: classLoading } = useSelector((state) => state.sclass);
    // Get institutional data from Redux
    const { currentUser } = useSelector(state => state.user);
    // const { sclassesList } = useSelector(state => state.sclass);
    const schoolID = currentUser._id;

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const [selectedSclass, setSelectedSclass] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !selectedSclass) {
            alert("Please select both a class and an Excel file.");
            return;
        }

        const formData = new FormData();
        formData.append('excelFile', file);
        formData.append('school', schoolID);
        formData.append('sclassName', selectedSclass); // This was missing!

        setLoader(true);
        try {
            const res = await axios.post(`${BASEURL}/BulkStudentReg`, formData);
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Registry update failed. Check console for details.");
        }
        setLoader(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <DossierPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Mass Enrollment Portal</ClassicTitle>
                    <ClassicSubtitle>Follow the institutional format for scholar registration</ClassicSubtitle>
                </HeaderSection>

                <Stack spacing={4} alignItems="center">
                    {/* NEW: Template Download Section */}
                    <Box sx={{ textAlign: 'center', width: '100%', p: 3, border: '1px solid #e0dcd0', bgcolor: '#fdfcf8' }}>
                        <Typography sx={{ fontFamily: 'serif', mb: 2, fontStyle: 'italic' }}>
                            Step 1: Obtain the official enrollment template to ensure data integrity.
                        </Typography>
                        <ClassicOutlineButton onClick={downloadScholarTemplate}>
                            Download Sample Ledger (.xlsx)
                        </ClassicOutlineButton>
                    </Box>
                    <Box sx={{ mb: 3, width: '100%' }}>
                        <LabelText>Target Academic Cohort</LabelText>
                        <FormControl fullWidth>
                            <ClassicSelect
                                value={selectedSclass}
                                onChange={(e) => setSelectedSclass(e.target.value)}
                                displayEmpty
                                disabled={classLoading} // Show disabled state while loading
                            >
                                <MenuItem value="" disabled>
                                    {classLoading ? "Loading Registry..." : "Select Class for this Batch"}
                                </MenuItem>

                                {/* Safe mapping with optional chaining */}
                                {sclassesList && sclassesList.length > 0 ? (
                                    sclassesList.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.sclassName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Classes Found in Registry</MenuItem>
                                )}
                            </ClassicSelect>
                        </FormControl>
                    </Box>
                    {/* Upload Section */}
                    <UploadZone>
                        <Typography sx={{ fontFamily: 'serif', mb: 2 }}>
                            Step 2: Select the completed enrollment ledger for verification.
                        </Typography>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} id="excel-upload" style={{ display: 'none' }} />
                        <label htmlFor="excel-upload">
                            <Primary3DButton as="span" style={{ fontSize: '0.8rem', padding: '8px 20px' }}>
                                Browse Local Files
                            </Primary3DButton>
                        </label>
                        {file && <Typography sx={{ mt: 2, fontWeight: 'bold' }}>{file.name}</Typography>}
                    </UploadZone>

                    <Primary3DButton
                        onClick={handleUpload}
                        disabled={loader || !file}
                        sx={{ width: '100%' }}
                    >
                        {loader ? <CircularProgress size={24} color="inherit" /> : "Authorize Mass Enrollment"}
                    </Primary3DButton>
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

const ClassicSelect = styled(Select)`
    && {
        font-family: serif;
        & .MuiOutlinedInput-root {
            border-color: #e0dcd0;
        }
    }
`;

const LabelText = styled(Typography)`
    && { font-family: serif; font-weight: 500; margin-bottom: 8px; color: #1a1a1a; }
`;
