import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, Box, Typography, TextField, Paper, Stack, Button } from '@mui/material';
import styled from 'styled-components';
import Popup from '../../../components/Popup';

const AddNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, response, error, currentUser } = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const adminID = currentUser._id;

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const fields = { title, details, date, adminID };
    const address = "Notice";

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate('/Admin/notices');
            dispatch(underControl());
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <StyledContainer>
            <StyledPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Issue Official Notice</ClassicTitle>
                    <ClassicSubtitle>Formal announcements for students and faculty</ClassicSubtitle>
                </HeaderSection>

                <form onSubmit={submitHandler}>
                    <Stack spacing={4}>
                        <ClassicTextField
                            label="Notice Subject"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <ClassicTextField
                            label="Announcement Details"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            required
                        />

                        <ClassicTextField
                            label="Date of Publication"
                            type="date"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Primary3DButton type="submit" disabled={loader}>
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Publish Notice"}
                            </Primary3DButton>
                            
                            <SecondaryButton onClick={() => navigate(-1)}>
                                Cancel and Return
                            </SecondaryButton>
                        </Box>
                    </Stack>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default AddNotice;

// --- CLASSIC STYLED COMPONENTS ---

const StyledContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
`;

const StyledPaper = styled(Paper)`
    && {
        width: 100%;
        max-width: 600px;
        padding: 60px 50px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
        border-radius: 0;
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    text-align: left;
`;

const ClassicTitle = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 400;
        font-size: 1.8rem;
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