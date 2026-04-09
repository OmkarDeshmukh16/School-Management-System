import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';

import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton, Typography, CircularProgress
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from 'styled-components';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Administrative restriction: Manual deletion of curriculum records is currently disabled.");
        setShowPopup(true);
    };

    const subjectColumns = [
        { id: 'subName', label: 'Subject Designation', minWidth: 170 },
        { id: 'sessions', label: 'Academic Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Assigned Class', minWidth: 170 },
    ];

    const subjectRows = subjectsList?.map((subject) => ({
        subName: subject.subName,
        sessions: subject.sessions,
        sclassName: subject.sclassName.sclassName,
        sclassID: subject.sclassName._id,
        id: subject._id,
    }));

    const SubjectsButtonHaver = ({ row }) => (
        <ActionContainer>
            <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                <DeleteIcon color="error" fontSize="small" />
            </IconButton>
            <ClassicSmallButton onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                <VisibilityIcon fontSize="inherit" sx={{ mr: 1 }} /> View Ledger
            </ClassicSmallButton>
        </ActionContainer>
    );

    const actions = [
        {
            icon: <PostAddIcon />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon />, name: 'Purge Directory',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Curriculum Directory</TypographyClassic>
                    <TypographySubtitle>A formal record of academic disciplines and course allocations</TypographySubtitle>
                </Box>
                {subjectsList && subjectsList.length > 0 && (
                    <Classic3DButton onClick={() => navigate("/Admin/subjects/chooseclass")}>
                        + New Subject
                    </Classic3DButton>
                )}
            </RegistryHeader>

            {loading ? (
                <LoaderContainer>
                    <CircularProgress color="inherit" />
                </LoaderContainer>
            ) : (
                <>
                    {response ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>
                                No subjects currently recorded in the curriculum.
                            </Typography>
                            <Classic3DButton onClick={() => navigate("/Admin/subjects/chooseclass")}>
                                Establish First Subject
                            </Classic3DButton>
                        </EmptyState>
                    ) : (
                        <TableWrapper>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={SubjectsButtonHaver} 
                                    columns={subjectColumns} 
                                    rows={subjectRows} 
                                />
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </TableWrapper>
                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </RegistryContainer>
    );
};

export default ShowSubjects;

// --- CLASSIC STYLED COMPONENTS ---

const RegistryContainer = styled(Box)`
    padding: 20px;
`;

const RegistryHeader = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
`;

const TypographyClassic = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        color: #1a1a1a;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
`;

const TypographySubtitle = styled.p`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
    margin: 5px 0 0 0;
`;

const TableWrapper = styled(Paper)`
    && {
        border-radius: 0;
        border: 1px solid #e0dcd0;
        box-shadow: none;
        background-color: #ffffff;
        
        & .MuiTableCell-head {
            background-color: #1a1a1a;
            color: white;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.85rem;
        }

        & .MuiTableCell-body {
            font-family: 'serif';
            color: #444;
        }
    }
`;

const ActionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
`;

const ClassicSmallButton = styled.button`
    background: none;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 6px 16px;
    font-family: serif;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #1a1a1a;
        color: white;
    }
`;

const Classic3DButton = styled.button`
    background-color: #1a1a1a;
    color: white;
    border: none;
    padding: 12px 24px;
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
`;

const EmptyState = styled(Box)`
    text-align: center;
    padding: 80px 60px;
    border: 1px dashed #e0dcd0;
    background-color: #fdfcf8;
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
    color: #1a1a1a;
`;