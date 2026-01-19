import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress, Box, Typography, TextField, Paper, Stack, Button, MenuItem } from '@mui/material';
import styled from 'styled-components';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [className, setClassName] = useState('')
    const [sclassName, setSclassName] = useState('')

    const adminID = currentUser._id
    const role = "Student"
    const attendance = []

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(underControl());
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    }

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance }

    const submitHandler = (event) => {
        event.preventDefault()
        if (sclassName === "") {
            setMessage("Please select a designated class")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
        }
        else if (status === 'failed') {
            setMessage(response === "Student not found"
                ? "The system could not establish this student record. Please verify the Roll Number."
                : response);
            setShowPopup(true);
            setLoader(false);
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, response, dispatch]);

    return (
        <StyledContainer>
            <StyledPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Student Enrollment</ClassicTitle>
                    <ClassicSubtitle>Register a new student into the institutional database</ClassicSubtitle>
                </HeaderSection>

                <form onSubmit={submitHandler}>
                    <Stack spacing={3}>
                        <ClassicTextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />

                        {situation === "Student" && (
                            <ClassicTextField
                                select
                                label="Designated Class"
                                value={className || 'Select Class'}
                                onChange={changeHandler}
                                fullWidth
                                required
                            >
                                <MenuItem value='Select Class'><em>Select Class</em></MenuItem>
                                {sclassesList.map((classItem, index) => (
                                    <MenuItem key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </MenuItem>
                                ))}
                            </ClassicTextField>
                        )}

                        <ClassicTextField
                            label="Roll Number"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={rollNum}
                            onChange={(e) => setRollNum(e.target.value)}
                            required
                        />

                        <ClassicTextField
                            label="Security Password"
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
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Enroll Student"}
                            </Primary3DButton>

                            <SecondaryButton onClick={() => navigate(-1)}>
                                Return to Directory
                            </SecondaryButton>
                        </Box>
                    </Stack>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default AddStudent;

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
        box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
        border-radius: 0;
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 35px;
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

const Primary3DButton = styled(Button)`
    && {
        background-color: #1a1a1a;
        color: white;
        padding: 14px;
        border-radius: 0;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 4px 4px 0px #7d6b5d;
        transition: all 0.2s ease;

        &:hover {
            background-color: #333;
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #7d6b5d;
        }
        &:active {
            transform: translate(1px, 1px);
            box-shadow: 2px 2px 0px #7d6b5d;
        }
    }
`;

const SecondaryButton = styled(Button)`
    && {
        color: #1a1a1a;
        border-radius: 0;
        font-family: serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.8rem;
        text-decoration: underline;
        &:hover { 
            background: transparent; 
            color: #7d6b5d;
            text-decoration: underline;
        }
    }
`;