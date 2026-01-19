import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../../assets/designlogin.jpg"
import { registerUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import Popup from '../../components/Popup';

const AdminRegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);
    const role = "Admin"

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName }
        setLoader(true)
        dispatch(registerUser(fields, role))
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'schoolName') setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setLoader(false)
            setMessage("Registry sync failed")
            setShowPopup(true)
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh' }}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square 
                    sx={{ backgroundColor: '#f9f7f2', borderRight: '1px solid #e0dcd0' }}>
                    
                    <Box sx={{ my: 8, mx: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        
                        <HeaderSection>
                            <ClassicTitle variant="h4">Institutional Registry</ClassicTitle>
                            <ClassicSubtitle>Establish a new administrative archive for your institution</ClassicSubtitle>
                        </HeaderSection>

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <LabelText>Administrative Full Name</LabelText>
                            <ClassicTextField
                                margin="normal" required fullWidth id="adminName"
                                name="adminName" autoComplete="name" autoFocus
                                error={adminNameError}
                                helperText={adminNameError && 'Identity verification required'}
                                onChange={handleInputChange}
                            />
                            
                            <LabelText>Institution Designation</LabelText>
                            <ClassicTextField
                                margin="normal" required fullWidth id="schoolName"
                                name="schoolName" autoComplete="off"
                                error={schoolNameError}
                                helperText={schoolNameError && 'Institutional name required'}
                                onChange={handleInputChange}
                            />

                            <LabelText>Electronic Mail Address</LabelText>
                            <ClassicTextField
                                margin="normal" required fullWidth id="email"
                                name="email" autoComplete="email"
                                error={emailError}
                                helperText={emailError && 'Valid contact address required'}
                                onChange={handleInputChange}
                            />

                            <LabelText>Security Passphrase</LabelText>
                            <ClassicTextField
                                margin="normal" required fullWidth name="password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                error={passwordError}
                                helperText={passwordError && 'Security key required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormControlLabel
                                control={<Checkbox value="remember" sx={{ color: '#1a1a1a', '&.Mui-checked': { color: '#1a1a1a' } }} />}
                                label={<Typography sx={{ fontFamily: 'serif', fontSize: '0.9rem' }}>Authorize session persistence</Typography>}
                                sx={{ mt: 1 }}
                            />

                            <Primary3DButton type="submit" fullWidth disabled={loader}>
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Establish Registry"}
                            </Primary3DButton>

                            <Grid container sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0dcd0' }}>
                                <Grid item>
                                    <Typography sx={{ fontFamily: 'serif', color: '#7d6b5d' }}>
                                        Existing Administrator?{" "}
                                        <StyledLink to="/Adminlogin">Access Portal</StyledLink>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={false} sm={4} md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(0.2) contrast(1.1)',
                    }}
                />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
}

export default AdminRegisterPage;

// --- CLASSIC STYLED COMPONENTS ---

const HeaderSection = styled(Box)`
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    width: 100%;
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
    margin: 15px 0 0 0;
    letter-spacing: 1px;
    font-weight: 700;
`;

const ClassicTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 0;
        font-family: 'Georgia', serif;
        background-color: #ffffff;
        & fieldset { border-color: #e0dcd0; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
    }
    & .MuiFormHelperText-root {
        font-family: serif;
        font-style: italic;
    }
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    border: none;
    padding: 14px;
    margin-top: 25px;
    width: 100%;
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
    
    &:disabled {
        background-color: #ccc;
        box-shadow: none;
        cursor: not-allowed;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #1a1a1a;
    font-weight: bold;
    border-bottom: 1px solid #1a1a1a;
    &:hover {
        background-color: #f4f1ea;
    }
`;