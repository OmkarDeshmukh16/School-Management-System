import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import styled from 'styled-components';

import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl, Paper
} from '@mui/material';
import Popup from '../../../components/Popup';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams();

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            dispatch(getUserDetails(params.id, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params;
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation, params, dispatch]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails, situation]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const fields = { subName: chosenSubName, marksObtained }

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"));
    }

    useEffect(() => {
        if (response) {
            setLoader(false);
            setShowPopup(true);
            setMessage(response);
        }
        else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("Error occurred during record update.");
        }
        else if (statestatus === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Academic record updated successfully.");
        }
    }, [response, statestatus, error]);

    return (
        <Box sx={{ backgroundColor: '#f9f7f2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
            {loading ? (
                <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
            ) : (
                <StyledPaper elevation={0}>
                    <HeaderSection>
                        <ClassicTitle variant="h4">Academic Grade Ledger</ClassicTitle>
                        <ClassicSubtitle>Formal entry of examination results into student archives</ClassicSubtitle>
                    </HeaderSection>

                    <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid #eee' }}>
                        <LabelText>Scholar Name</LabelText>
                        <ValueText>{userDetails.name}</ValueText>
                        
                        {currentUser.teachSubject && (
                            <Box sx={{ mt: 2 }}>
                                <LabelText>Academic Subject</LabelText>
                                <ValueText>{currentUser.teachSubject?.subName}</ValueText>
                            </Box>
                        )}
                    </Box>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={4}>
                            {situation === "Student" && (
                                <FormControl fullWidth>
                                    <StyledInputLabel>Subject Designation</StyledInputLabel>
                                    <ClassicSelect
                                        value={subjectName}
                                        label="Subject Designation"
                                        onChange={changeHandler} required
                                    >
                                        {subjectsList ? 
                                            subjectsList.map((subject, index) => (
                                                <MenuItem key={index} value={subject.subName} sx={{ fontFamily: 'serif' }}>
                                                    {subject.subName}
                                                </MenuItem>
                                            )) : (
                                                <MenuItem value=""><em>Assign Subjects for Grading</em></MenuItem>
                                            )
                                        }
                                    </ClassicSelect>
                                </FormControl>
                            )}

                            <ClassicTextField
                                label="Marks Obtained"
                                type="number"
                                fullWidth
                                value={marksObtained} 
                                required
                                onChange={(e) => setMarksObtained(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />

                            <Primary3DButton
                                type="submit"
                                disabled={loader}
                                fullWidth
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Authorize Entry"}
                            </Primary3DButton>
                        </Stack>
                    </form>
                </StyledPaper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
}

export default StudentExamMarks;

// --- CLASSIC STYLED COMPONENTS ---

const StyledPaper = styled(Paper)`
    && {
        width: 100%;
        max-width: 550px;
        padding: 60px 50px;
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

const LabelText = styled.p`
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #7d6b5d;
    margin: 0;
    letter-spacing: 1px;
    font-weight: bold;
`;

const ValueText = styled.p`
    font-family: 'Georgia', serif;
    font-size: 1.3rem;
    color: #1a1a1a;
    margin: 4px 0 0 0;
`;

const StyledInputLabel = styled(InputLabel)`
    &.MuiInputLabel-root {
        font-family: serif;
        &.Mui-focused { color: #1a1a1a; }
    }
`;

const ClassicSelect = styled(Select)`
    &.MuiOutlinedInput-root {
        border-radius: 0;
        font-family: 'Georgia', serif;
        & fieldset { border-color: #e0dcd0; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
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
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        box-shadow: none;
    }
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1a1a1a;
`;