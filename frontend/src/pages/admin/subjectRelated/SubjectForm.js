import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Paper, IconButton } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Popup from '../../../components/Popup';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response } = userState;

    const sclassName = params.id
    const adminID = currentUser._id
    const address = "Subject"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error: Archive synchronization failed.")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, response, dispatch]);

    return (
        <StyledContainer>
            <StyledPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Curriculum Entry</ClassicTitle>
                    <ClassicSubtitle>Define and catalog new academic disciplines for the registry</ClassicSubtitle>
                </HeaderSection>

                <form onSubmit={submitHandler}>
                    {subjects.map((subject, index) => (
                        <EntryRow key={index}>
                            <RowHeader>
                                <Typography variant="button" sx={{ color: '#7d6b5d', letterSpacing: 2 }}>
                                    Subject #{index + 1}
                                </Typography>
                                {index > 0 && (
                                    <IconButton onClick={handleRemoveSubject(index)} color="error" size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </RowHeader>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={5}>
                                    <ClassicTextField
                                        fullWidth
                                        label="Subject Designation"
                                        variant="outlined"
                                        value={subject.subName}
                                        onChange={handleSubjectNameChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <ClassicTextField
                                        fullWidth
                                        label="Course Code"
                                        variant="outlined"
                                        value={subject.subCode}
                                        onChange={handleSubjectCodeChange(index)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <ClassicTextField
                                        fullWidth
                                        label="Total Sessions"
                                        variant="outlined"
                                        type="number"
                                        value={subject.sessions}
                                        onChange={handleSessionsChange(index)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </EntryRow>
                    ))}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AddButton startIcon={<AddCircleOutlineIcon />} onClick={handleAddSubject}>
                            Add Another Discipline
                        </AddButton>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <SecondaryButton onClick={() => navigate(-1)}>
                                Cancel
                            </SecondaryButton>
                            <Primary3DButton type="submit" disabled={loader}>
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Authorize Registry"}
                            </Primary3DButton>
                        </Box>
                    </Box>
                </form>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </StyledContainer>
    );
}

export default SubjectForm;

// --- CLASSIC STYLED COMPONENTS ---

const StyledContainer = styled(Box)`
    padding: 40px;
    display: flex;
    justify-content: center;
    background-color: #f9f7f2;
    min-height: 90vh;
`;

const StyledPaper = styled(Paper)`
    && {
        width: 100%;
        max-width: 900px;
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

const EntryRow = styled(Box)`
    padding: 25px;
    border: 1px solid #eee;
    background-color: #fdfcf8;
    margin-bottom: 25px;
    position: relative;
`;

const RowHeader = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

const ClassicTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 0;
        font-family: 'Georgia', serif;
        background-color: #ffffff;
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
        padding: 12px 30px;
        border-radius: 0;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 4px 4px 0px #7d6b5d;
        transition: all 0.2s ease;
        &:hover {
            background-color: #333;
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #7d6b5d;
        }
    }
`;

const AddButton = styled(Button)`
    && {
        color: #7d6b5d;
        font-family: serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.8rem;
        border-radius: 0;
        border: 1px dashed #e0dcd0;
        padding: 10px 20px;
        &:hover { background-color: #fdfcf8; border-color: #1a1a1a; color: #1a1a1a; }
    }
`;

const SecondaryButton = styled(Button)`
    && {
        color: #1a1a1a;
        font-family: serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.8rem;
        &:hover { text-decoration: underline; background: transparent; }
    }
`;