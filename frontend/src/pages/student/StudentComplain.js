import { useEffect, useState } from 'react';
import { Box, Stack, TextField, Typography, Paper } from '@mui/material';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id
    const school = currentUser.school._id

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = { user, date, complaint, school };

    const submitGrievance = async () => {
    try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/ComplainCreate`, {
            user: currentUser._id,
            complaint: complaint,
            school: currentUser.school._id,
            date: new Date(),
        });
        alert("Grievance lodged in the official registry.");
        setComplaint("");
    } catch (err) {
        alert("Submission failed.");
        console.error(err);
    }
};

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Grievance recorded successfully in the institutional archive.")
            setComplaint("");
            setDate("");
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error: Connectivity to the registry failed.")
        }
    }, [status, error])

    return (
        <StyledContainer>
            <StyledPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Grievance Submission</ClassicTitle>
                    <ClassicSubtitle>Formal documentation for administrative review and resolution</ClassicSubtitle>
                </HeaderSection>

                <form onSubmit={submitGrievance}>
                    <Stack spacing={4}>
                        <Box>
                            <LabelText>Incident Date</LabelText>
                            <ClassicTextField
                                fullWidth
                                type="date"
                                variant="outlined"
                                value={date}
                                onChange={(event) => setDate(event.target.value)} 
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        <Box>
                            <LabelText>Description of Grievance</LabelText>
                            <ClassicTextField
                                fullWidth
                                placeholder="Detail the specific nature of your concern..."
                                variant="outlined"
                                value={complaint}
                                onChange={(event) => setComplaint(event.target.value)}
                                required
                                multiline
                                rows={6}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <Primary3DButton 
                                onClick={submitGrievance} sx={{ mt: 2 }}
                            >Submit
                            </Primary3DButton>
                        </Box>
                    </Stack>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
};

export default StudentComplain;

// --- CLASSIC STYLED COMPONENTS ---

const StyledContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 85vh;
    background-color: #f9f7f2;
    padding: 20px;
`;

const StyledPaper = styled(Paper)`
    && {
        width: 100%;
        max-width: 650px;
        padding: 60px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
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
        font-size: 0.9rem;
        margin-top: 8px;
    }
`;

const LabelText = styled.p`
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #7d6b5d;
    margin: 0 0 8px 0;
    letter-spacing: 1px;
    font-weight: 700;
`;

const ClassicTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 0;
        font-family: 'Georgia', serif;
        background-color: #fdfcf8;
        & fieldset { border-color: #e0dcd0; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
    }
`;

const Primary3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    border: none;
    padding: 14px 30px;
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