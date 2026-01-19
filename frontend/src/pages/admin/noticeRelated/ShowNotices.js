import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Paper, Box, IconButton, Typography, CircularProgress
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import styled from 'styled-components';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            });
    };

    const noticeColumns = [
        { id: 'title', label: 'Announcement Title', minWidth: 170 },
        { id: 'details', label: 'Details & Description', minWidth: 100 },
        { id: 'date', label: 'Date of Issue', minWidth: 170 },
    ];

    const noticeRows = noticesList?.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "N/A";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const NoticeButtonHaver = ({ row }) => (
        <IconButton onClick={() => deleteHandler(row.id, "Notice")}>
            <DeleteIcon color="error" fontSize="small" />
        </IconButton>
    );

    const actions = [
        {
            icon: <NoteAddIcon />, name: 'Issue New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon />, name: 'Purge Archive',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Notice Archive</TypographyClassic>
                    <TypographySubtitle>Historical log of institutional announcements and circulars</TypographySubtitle>
                </Box>
                {noticesList && noticesList.length > 0 && (
                    <Classic3DButton onClick={() => navigate("/Admin/addnotice")}>
                        + New Announcement
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
                                No announcements currently active in the ledger.
                            </Typography>
                            <Classic3DButton onClick={() => navigate("/Admin/addnotice")}>
                                Record First Notice
                            </Classic3DButton>
                        </EmptyState>
                    ) : (
                        <TableWrapper>
                            {Array.isArray(noticesList) && noticesList.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={NoticeButtonHaver} 
                                    columns={noticeColumns} 
                                    rows={noticeRows} 
                                />
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </TableWrapper>
                    )}
                </>
            )}
        </RegistryContainer>
    );
};

export default ShowNotices;

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