import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';
import { Box, Paper, Typography } from '@mui/material';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <LogoutBackground>
            <StyledLogoutCard elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Session Termination</ClassicTitle>
                    <ClassicSubtitle>Formal request to exit the institutional portal</ClassicSubtitle>
                </HeaderSection>
                
                <UserIdentity>
                    <LabelText>Logged Account</LabelText>
                    <ValueText>{currentUser?.name}</ValueText>
                </UserIdentity>

                <LogoutMessage>
                    Are you certain you wish to conclude your current session? 
                    All unsaved changes to active ledgers may be lost.
                </LogoutMessage>

                <ActionStack>
                    <LogoutButtonLogout onClick={handleLogout}>
                        Confirm Logout
                    </LogoutButtonLogout>
                    <LogoutButtonCancel onClick={handleCancel}>
                        Return to Dashboard
                    </LogoutButtonCancel>
                </ActionStack>
            </StyledLogoutCard>
        </LogoutBackground>
    );
};

export default Logout;

// --- CLASSIC STYLED COMPONENTS ---

const LogoutBackground = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background-color: #f9f7f2;
`;

const StyledLogoutCard = styled(Paper)`
    && {
        width: 100%;
        max-width: 450px;
        padding: 50px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 8px 8px 0px #e0dcd0; /* Tactical 3D Shadow */
        text-align: center;
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
        font-size: 1.4rem;
    }
`;

const ClassicSubtitle = styled(Typography)`
    && {
        font-family: serif;
        font-style: italic;
        color: #7d6b5d;
        font-size: 0.85rem;
        margin-top: 5px;
    }
`;

const UserIdentity = styled(Box)`
    margin-bottom: 25px;
    padding: 15px;
    background-color: #fdfcf8;
    border: 1px solid #eee;
`;

const LabelText = styled.p`
    font-family: serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #7d6b5d;
    margin: 0;
    letter-spacing: 1px;
    font-weight: 700;
`;

const ValueText = styled.p`
    font-family: 'Georgia', serif;
    font-size: 1.1rem;
    color: #1a1a1a;
    margin: 2px 0 0 0;
`;

const LogoutMessage = styled.p`
    font-family: serif;
    margin-bottom: 35px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #444;
`;

const ActionStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const ClassicButton = styled.button`
    padding: 12px 20px;
    border: none;
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
`;

const LogoutButtonLogout = styled(ClassicButton)`
    background-color: #1a1a1a;
    color: white;
    box-shadow: 4px 4px 0px #7d6b5d;
    
    &:hover {
        background-color: #d32f2f; /* Turns subtle red on hover for danger awareness */
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px #7d6b5d;
    }
`;

const LogoutButtonCancel = styled(ClassicButton)`
    background-color: transparent;
    color: #1a1a1a;
    border: 1px solid #1a1a1a;
    
    &:hover {
        background-color: #f9f7f2;
        text-decoration: underline;
    }
`;