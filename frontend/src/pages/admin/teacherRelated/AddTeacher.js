import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, Box, Typography, TextField, Paper, Stack } from '@mui/material';
import styled from 'styled-components';
import Popup from '../../../components/Popup';

const AddTeacher = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subjectID = params.id;
    const { status, response } = useSelector(state => state.user);
    const { subjectDetails } = useSelector((state) => state.sclass);

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
    }, [dispatch, subjectID]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const role = "Teacher";
    const school = subjectDetails?.school;
    const teachSubject = subjectDetails?._id;
    const teachSclass = subjectDetails?.sclassName?._id;

    const fields = { name, email, password, role, school, teachSubject, teachSclass };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate("/Admin/teachers");
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error: Connectivity with the archive failed.");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, response, dispatch]);

    return (
        <StyledContainer>
            <StyledPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Faculty Appointment</ClassicTitle>
                    <ClassicSubtitle>Assigning an educator to the academic directory</ClassicSubtitle>
                </HeaderSection>

                {/* Assignment Meta Information */}
                <MetaContainer>
                    <MetaItem>
                        <Label>Subject Assignment</Label>
                        <Value>{subjectDetails?.subName || "Loading..."}</Value>
                    </MetaItem>
                    <MetaItem>
                        <Label>Academic Class</Label>
                        <Value>{subjectDetails?.sclassName?.sclassName || "Loading..."}</Value>
                    </MetaItem>
                </MetaContainer>

                <form onSubmit={submitHandler}>
                    <Stack spacing={3}>
                        <ClassicTextField
                            label="Full Legal Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />

                        <ClassicTextField
                            label="Institutional Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />

                        <ClassicTextField
                            label="Access Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Primary3DButton type="submit" disabled={loader}>
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Appoint Teacher"}
                            </Primary3DButton>
                            
                            <SecondaryButton onClick={() => navigate(-1)}>
                                Return to Faculty Directory
                            </SecondaryButton>
                        </Box>
                    </Stack>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default AddTeacher;

// --- CLASSIC STYLED COMPONENTS ---

const StyledContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 85vh;
    padding: 20px;
`;

const StyledPaper = styled(Paper)`
    && {
        width: 100%;
        max-width: 550px;
        padding: 50px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        box-shadow: 8px 8px 0px #e0dcd0;
        border-radius: 0;
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 30px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 15px;
`;

const ClassicTitle = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 400;
        font-size: 1.6rem;
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

const MetaContainer = styled(Box)`
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
    padding: 15px;
    background-color: #fdfcf8;
    border: 1px solid #eee;
`;

const MetaItem = styled(Box)`
    display: flex;
    flex-direction: column;
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
    font-size: 1rem;
    color: #1a1a1a;
    margin: 2px 0 0 0;
`;

const ClassicTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 0;
        font-family: 'Georgia', serif;
        & fieldset { border-color: #e0dcd0; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
    }
    & .MuiInputLabel-root {
        font-family: serif;
        &.Mui-focused { color: #1a1a1a; }
    }
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    padding: 14px;
    border: none;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    box-shadow: 4px 4px 0px #7d6b5d;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: #333;
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px #7d6b5d;
    }
    &:active {
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0px #7d6b5d;
    }
`;

const SecondaryButton = styled.button`
    background: none;
    border: none;
    color: #1a1a1a;
    font-family: serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
    &:hover { color: #7d6b5d; }
`;