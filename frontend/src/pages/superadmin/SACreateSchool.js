import React, { useState } from 'react';
import { Grid, Box, TextField, Select, MenuItem, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styled from 'styled-components';
import axios from 'axios';
import { BASEURL } from '../../utils/apiConfig';

const SACreateSchool = () => {
    const [form, setForm] = useState({
        schoolName:'', email:'', phone:'', address:'',
        adminName:'', adminEmail:'', adminPassword:'',
        plan:'free', board:'', medium:''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const e = {};
        if (!form.schoolName.trim()) e.schoolName = 'Required';
        if (!form.email.trim()) e.email = 'Required';
        if (!form.adminName.trim()) e.adminName = 'Required';
        if (!form.adminEmail.trim()) e.adminEmail = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) e.adminEmail = 'Invalid email';
        if (!form.adminPassword) e.adminPassword = 'Required';
        else if (form.adminPassword.length < 6) e.adminPassword = 'Min 6 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(p => ({...p, [name]: value}));
        if (errors[name]) setErrors(p => ({...p, [name]: ''}));
        setServerError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError('');
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.post(`${BASEURL}/SuperAdmin/CreateSchool`, form, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setResult(res.data);
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to create school');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (result) {
        return (
            <div>
                <PageHeader>
                    <PageTitle>School Created</PageTitle>
                    <PageSubtitle>Share these credentials with the school administrator</PageSubtitle>
                </PageHeader>
                <SuccessCard>
                    <CheckCircleOutlineIcon sx={{ fontSize: 50, color: '#2e7d32', mb: 2 }} />
                    <SuccessTitle>{result.school?.schoolName}</SuccessTitle>
                    <CredentialGrid>
                        <CredRow>
                            <CredLabel>School ID</CredLabel>
                            <CredValue>
                                {result.credentials?.schoolId}
                                <CopyBtn onClick={() => copyToClipboard(result.credentials?.schoolId)}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </CopyBtn>
                            </CredValue>
                        </CredRow>
                        <CredRow>
                            <CredLabel>Login Email</CredLabel>
                            <CredValue>
                                {result.credentials?.email}
                                <CopyBtn onClick={() => copyToClipboard(result.credentials?.email)}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </CopyBtn>
                            </CredValue>
                        </CredRow>
                        <CredRow>
                            <CredLabel>Password</CredLabel>
                            <CredValue>
                                {result.credentials?.password}
                                <CopyBtn onClick={() => copyToClipboard(result.credentials?.password)}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </CopyBtn>
                            </CredValue>
                        </CredRow>
                        <CredRow>
                            <CredLabel>Plan</CredLabel>
                            <CredValue style={{textTransform:'capitalize'}}>{result.school?.plan}</CredValue>
                        </CredRow>
                    </CredentialGrid>
                    <CreateAnotherBtn onClick={() => { setResult(null); setForm({schoolName:'',email:'',phone:'',address:'',adminName:'',adminEmail:'',adminPassword:'',plan:'free',board:'',medium:''}); }}>
                        Create Another School
                    </CreateAnotherBtn>
                </SuccessCard>
            </div>
        );
    }

    return (
        <div>
            <PageHeader>
                <PageTitle>Create New School</PageTitle>
                <PageSubtitle>Onboard a new institution and generate admin credentials</PageSubtitle>
            </PageHeader>
            <FormCard>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <SectionLabel>School Information</SectionLabel>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FieldLabel>School Name *</FieldLabel>
                            <SField fullWidth name="schoolName" value={form.schoolName} onChange={handleChange}
                                error={!!errors.schoolName} helperText={errors.schoolName} placeholder="e.g. Springfield Public School" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FieldLabel>School Email *</FieldLabel>
                            <SField fullWidth name="email" value={form.email} onChange={handleChange}
                                error={!!errors.email} helperText={errors.email} placeholder="e.g. info@school.com" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FieldLabel>Phone</FieldLabel>
                            <SField fullWidth name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FieldLabel>Address</FieldLabel>
                            <SField fullWidth name="address" value={form.address} onChange={handleChange} placeholder="City, State" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldLabel>Board</FieldLabel>
                            <SField fullWidth name="board" value={form.board} onChange={handleChange} placeholder="e.g. CBSE" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldLabel>Medium</FieldLabel>
                            <SField fullWidth name="medium" value={form.medium} onChange={handleChange} placeholder="e.g. English" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldLabel>Plan</FieldLabel>
                            <Select fullWidth name="plan" value={form.plan} onChange={handleChange} size="small"
                                sx={{ borderRadius:0, fontFamily:"'Georgia',serif", '& fieldset':{borderColor:'#e0dcd0'} }}>
                                <MenuItem value="free">Free</MenuItem>
                                <MenuItem value="foundation">Foundation</MenuItem>
                                <MenuItem value="professional">Professional</MenuItem>
                                <MenuItem value="enterprise">Enterprise</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    <Divider />
                    <SectionLabel>Admin Account</SectionLabel>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FieldLabel>Admin Name *</FieldLabel>
                            <SField fullWidth name="adminName" value={form.adminName} onChange={handleChange}
                                error={!!errors.adminName} helperText={errors.adminName} placeholder="Full Name" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldLabel>Admin Email *</FieldLabel>
                            <SField fullWidth name="adminEmail" value={form.adminEmail} onChange={handleChange}
                                error={!!errors.adminEmail} helperText={errors.adminEmail} placeholder="admin@school.com" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldLabel>Admin Password *</FieldLabel>
                            <SField fullWidth name="adminPassword" value={form.adminPassword} onChange={handleChange}
                                error={!!errors.adminPassword} helperText={errors.adminPassword} placeholder="Min 6 characters" />
                        </Grid>
                    </Grid>

                    {serverError && <ErrorBanner>{serverError}</ErrorBanner>}

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Create School & Generate Credentials'}
                    </SubmitButton>
                </Box>
            </FormCard>
        </div>
    );
};

export default SACreateSchool;

const PageHeader = styled.div`margin-bottom:30px;border-bottom:2px solid #1a1a1a;padding-bottom:15px;`;
const PageTitle = styled.h1`font-family:'Georgia',serif;font-size:1.8rem;color:#1a1a1a;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:400;`;
const PageSubtitle = styled.p`font-family:serif;font-style:italic;color:#7d6b5d;font-size:0.9rem;margin:0;`;
const FormCard = styled.div`background:#fff;border:1px solid #e0dcd0;padding:40px;box-shadow:6px 6px 0px #e0dcd0;`;
const SectionLabel = styled.h3`font-family:'Georgia',serif;text-transform:uppercase;letter-spacing:1px;color:#1a1a1a;font-size:0.95rem;margin:30px 0 15px;font-weight:400;&:first-of-type{margin-top:0;}`;
const FieldLabel = styled.p`font-family:serif;font-size:0.75rem;text-transform:uppercase;color:#7d6b5d;margin:0 0 4px;letter-spacing:1px;font-weight:700;`;
const SField = styled(TextField)`& .MuiOutlinedInput-root{border-radius:0;font-family:'Georgia',serif;background-color:#fafaf8;& fieldset{border-color:#e0dcd0;}&.Mui-focused fieldset{border-color:#1a1a1a;}}& .MuiFormHelperText-root{font-family:serif;font-style:italic;}`;
const Divider = styled.hr`border:none;border-top:1px solid #e0dcd0;margin:30px 0;`;
const ErrorBanner = styled.div`background-color:#fff5f5;border:1px solid #e53e3e;color:#c53030;padding:12px 16px;font-family:serif;font-size:0.9rem;margin:20px 0;`;
const SubmitButton = styled.button`background-color:#1a1a1a;color:#fff;border:none;padding:16px;width:100%;margin-top:30px;font-family:'Georgia',serif;text-transform:uppercase;letter-spacing:2px;font-size:0.9rem;cursor:pointer;box-shadow:5px 5px 0px #7d6b5d;transition:all 0.2s;display:flex;align-items:center;justify-content:center;&:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0px #7d6b5d;}&:disabled{background-color:#aaa;box-shadow:none;cursor:not-allowed;transform:none;}`;
const SuccessCard = styled.div`background:#fff;border:1px solid #e0dcd0;padding:50px;box-shadow:6px 6px 0px #e0dcd0;text-align:center;`;
const SuccessTitle = styled.h2`font-family:'Georgia',serif;font-size:1.5rem;color:#1a1a1a;text-transform:uppercase;letter-spacing:2px;margin:0 0 30px;`;
const CredentialGrid = styled.div`max-width:450px;margin:0 auto 30px;text-align:left;`;
const CredRow = styled.div`display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f0ece4;`;
const CredLabel = styled.span`font-family:serif;font-size:0.8rem;text-transform:uppercase;color:#7d6b5d;letter-spacing:1px;font-weight:700;`;
const CredValue = styled.span`font-family:'Courier New',monospace;font-size:0.95rem;color:#1a1a1a;display:flex;align-items:center;gap:8px;`;
const CopyBtn = styled.button`background:none;border:1px solid #e0dcd0;padding:4px 6px;cursor:pointer;color:#7d6b5d;border-radius:0;display:flex;align-items:center;&:hover{background-color:#f4f1ea;color:#1a1a1a;}`;
const CreateAnotherBtn = styled.button`background:none;border:1px solid #1a1a1a;color:#1a1a1a;padding:12px 30px;font-family:'Georgia',serif;text-transform:uppercase;letter-spacing:2px;font-size:0.85rem;cursor:pointer;&:hover{background-color:#1a1a1a;color:#fff;}`;
