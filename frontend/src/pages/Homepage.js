import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";

const Homepage = () => {
    return (
        <StyledContainer>
            <StyledGrid container>
                <Grid item xs={12} md={6}>
                    <ImageWrapper>
                        <img src={Students} alt="students" />
                    </ImageWrapper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <ContentWrapper>
                            <StyledTitle>
                                Welcome to the 
                                <br />
                                <span>School Management System</span>
                            </StyledTitle>
                            <StyledText>
                                A sophisticated platform designed to streamline administration, 
                                organize curricula, and manage student performance with precision.
                                Experience seamless communication and record-keeping in one unified space.
                            </StyledText>
                            <StyledBox>
                                <StyledLink to="/choose">
                                    <PrimaryButton variant="contained" fullWidth>
                                        Get Started
                                    </PrimaryButton>
                                </StyledLink>
                                <StyledLink to="/chooseasguest">
                                    <SecondaryButton variant="outlined" fullWidth>
                                        Continue as Guest
                                    </SecondaryButton>
                                </StyledLink>
                                <SignupText>
                                    Don't have an account?{' '}
                                    <SignupLink to="/Adminregister">
                                        Create one now
                                    </SignupLink>
                                </SignupText>
                            </StyledBox>
                        </ContentWrapper>
                    </StyledPaper>
                </Grid>
            </StyledGrid>
        </StyledContainer>
    );
};

export default Homepage;

// --- CLASSIC STYLES ---

const StyledContainer = styled.div`
  background-color: #f9f7f2; /* Classic off-white/cream */
  height: 100vh;
  display: flex;
`;

const StyledGrid = styled(Grid)`
  height: 100%;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #1a1a1a; /* Classic charcoal background */
  padding: 40px;

  img {
    max-width: 80%;
    filter: brightness(0.9) contrast(1.1); /* Makes the SVG feel less "cartoonish" */
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const StyledPaper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-left: 1px solid #e0e0e0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 40px;
`;

const StyledTitle = styled.h1`
  font-family: 'Georgia', serif; /* Classic serif font */
  font-size: 3rem;
  color: #1a1a1a;
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 30px;

  span {
    font-weight: 700;
    color: #4a4a4a;
    display: block;
    margin-top: 10px;
  }
`;

const StyledText = styled.p`
  font-family: 'Times New Roman', serif;
  font-size: 1.1rem;
  color: #444;
  line-height: 1.8;
  border-left: 3px solid #1a1a1a;
  padding-left: 20px;
  margin-bottom: 40px;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PrimaryButton = styled(Button)`
  && {
    background-color: #1a1a1a;
    color: white;
    padding: 12px;
    border-radius: 0; /* Square edges look more classic */
    font-family: serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    
    &:hover {
      background-color: #333;
    }
  }
`;

const SecondaryButton = styled(Button)`
  && {
    color: #1a1a1a;
    border: 1px solid #1a1a1a;
    padding: 12px;
    border-radius: 0;
    font-family: serif;
    text-transform: uppercase;
    letter-spacing: 2px;

    &:hover {
      background-color: #f0f0f0;
      border-color: #1a1a1a;
    }
  }
`;

const SignupText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-family: serif;
  font-style: italic;
  color: #666;
`;

const SignupLink = styled(Link)`
  color: #1a1a1a;
  font-weight: bold;
  text-decoration: underline;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;