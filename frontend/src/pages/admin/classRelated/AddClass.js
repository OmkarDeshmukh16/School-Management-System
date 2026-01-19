import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import styled from "styled-components";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = { sclassName, adminID };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id)
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, response, dispatch, tempDetails]);

    return (
        <>
            <StyledContainer>
                <StyledBox>
                    <Stack sx={{ alignItems: 'center', mb: 4 }}>
                        <ImageWrapper>
                            <img src={Classroom} alt="classroom" />
                        </ImageWrapper>
                        <ClassicTitle variant="h5">Register New Class</ClassicTitle>
                        <ClassicSubtitle>Enter the designation for the new academic group</ClassicSubtitle>
                    </Stack>
                    
                    <form onSubmit={submitHandler}>
                        <Stack spacing={4}>
                            <ClassicTextField
                                label="Class Name (e.g., Grade 10-A)"
                                variant="outlined"
                                value={sclassName}
                                onChange={(event) => setSclassName(event.target.value)}
                                required
                                fullWidth
                            />
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Primary3DButton
                                    type="submit"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Establish Class"}
                                </Primary3DButton>
                                
                                <SecondaryButton onClick={() => navigate(-1)}>
                                    Return to Directory
                                </SecondaryButton>
                            </Box>
                        </Stack>
                    </form>
                </StyledBox>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddClass;

// --- CLASSIC STYLED COMPONENTS ---

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
`;

const StyledBox = styled(Box)`
  max-width: 500px;
  width: 100%;
  padding: 60px 40px;
  background-color: white;
  border: 1px solid #e0dcd0;
  box-shadow: 8px 8px 0px #e0dcd0; /* Tactical Classic Shadow */
`;

const ImageWrapper = styled(Box)`
  width: 120px;
  margin-bottom: 20px;
  filter: grayscale(1) contrast(1.2); /* Matching the editorial photo look */
  img { width: 100%; }
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
    &:disabled {
        background-color: #ccc;
        box-shadow: none;
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
    &:hover { background: transparent; color: #7d6b5d; }
  }
`;