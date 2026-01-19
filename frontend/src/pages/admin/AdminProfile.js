import React, { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp, Person, Business, Email } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom'
import { authLogout } from '../../redux/userRelated/userSlice';
import { Button, Collapse, Box, Paper, Typography, Grid, TextField } from '@mui/material';
import styled from 'styled-components';

const AdminProfile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    // Cleaned up duplicate selectors
    const { currentUser, response, error } = useSelector((state) => state.user);
    const [showTab, setShowTab] = useState(false);
    const buttonText = showTab ? 'Cancel' : 'Edit Profile';

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const address = "Admin"
    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName }

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, currentUser._id, address))
        setShowTab(false)
    }

    const deleteHandler = () => {
        if (window.confirm("Are you sure you want to delete your profile? This action is permanent.")) {
            try {
                dispatch(deleteUser(currentUser._id, "Students"));
                dispatch(deleteUser(currentUser._id, address));
                dispatch(authLogout());
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <ProfileContainer>
            <Grid container spacing={4}>
                {/* Information Card */}
                <Grid item xs={12} md={5}>
                    <DossierCard>
                        <TypographyClassic variant="h5">Administrator Profile</TypographyClassic>
                        <DividerClassic />
                        
                        <InfoRow>
                            <Person fontSize="small" />
                            <Box>
                                <Label>Full Name</Label>
                                <Value>{currentUser.name}</Value>
                            </Box>
                        </InfoRow>

                        <InfoRow>
                            <Email fontSize="small" />
                            <Box>
                                <Label>Email Address</Label>
                                <Value>{currentUser.email}</Value>
                            </Box>
                        </InfoRow>

                        <InfoRow>
                            <Business fontSize="small" />
                            <Box>
                                <Label>Institution</Label>
                                <Value>{currentUser.schoolName}</Value>
                            </Box>
                        </InfoRow>

                        <ActionGroup>
                            <EditButton 
                                onClick={() => setShowTab(!showTab)}
                                startIcon={showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            >
                                {buttonText}
                            </EditButton>
                            <DeleteButton onClick={deleteHandler}>
                                Deactivate Account
                            </DeleteButton>
                        </ActionGroup>
                    </DossierCard>
                </Grid>

                {/* Edit Section */}
                <Grid item xs={12} md={7}>
                    <Collapse in={showTab} timeout="auto" unmountOnExit>
                        <EditPaper>
                            <SectionTitle>Update Credentials</SectionTitle>
                            <form onSubmit={submitHandler}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <ClassicField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ClassicField label="School Name" fullWidth value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ClassicField label="Email" fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ClassicField label="New Password (Leave blank to keep current)" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Update3DButton type="submit" fullWidth>
                                            Save Changes
                                        </Update3DButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </EditPaper>
                    </Collapse>
                </Grid>
            </Grid>
        </ProfileContainer>
    );
}

export default AdminProfile;

// --- CLASSIC STYLED COMPONENTS ---

const ProfileContainer = styled(Box)`
    padding: 20px;
`;

const DossierCard = styled(Paper)`
    && {
        padding: 40px;
        border-radius: 0;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        box-shadow: 6px 6px 0px #e0dcd0;
    }
`;

const TypographyClassic = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #1a1a1a;
    }
`;

const DividerClassic = styled.div`
    height: 2px;
    background-color: #1a1a1a;
    width: 50px;
    margin: 20px 0 30px 0;
`;

const InfoRow = styled(Box)`
    display: flex;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 25px;
    color: #444;
`;

const Label = styled.p`
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #7d6b5d;
    margin: 0;
    font-weight: 700;
`;

const Value = styled.p`
    font-family: 'Georgia', serif;
    font-size: 1.1rem;
    color: #1a1a1a;
    margin: 2px 0 0 0;
`;

const ActionGroup = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 40px;
`;

const EditButton = styled(Button)`
    && {
        border-radius: 0;
        background-color: #1a1a1a;
        color: white;
        padding: 10px;
        font-family: serif;
        &:hover { background-color: #333; }
    }
`;

const DeleteButton = styled(Button)`
    && {
        border-radius: 0;
        color: #d32f2f;
        border: 1px solid #d32f2f;
        padding: 10px;
        font-family: serif;
        font-size: 0.8rem;
        &:hover { background-color: #fff5f5; border-color: #b71c1c; }
    }
`;

const EditPaper = styled(Paper)`
    && {
        padding: 40px;
        border-radius: 0;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
    }
`;

const SectionTitle = styled.h3`
    font-family: 'Georgia', serif;
    margin-bottom: 25px;
    color: #1a1a1a;
    font-weight: 400;
`;

const ClassicField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 0;
        & fieldset { border-color: #e0dcd0; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
    }
`;

const Update3DButton = styled(Button)`
    && {
        background-color: #1a1a1a;
        color: white;
        padding: 12px;
        border-radius: 0;
        box-shadow: 4px 4px 0px #7d6b5d;
        text-transform: uppercase;
        letter-spacing: 2px;
        &:hover { background-color: #333; transform: translate(-1px, -1px); box-shadow: 5px 5px 0px #7d6b5d; }
    }
`;