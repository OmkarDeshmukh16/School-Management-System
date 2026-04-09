import React, { useEffect, useState } from "react";
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Typography, Paper, CircularProgress} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import styled from 'styled-components';

// Icons & Components
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ShowClasses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sclassesList, loading, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Administrative restriction: Manual deletion of class records is currently disabled.");
        setShowPopup(true);
    };

    const sclassColumns = [
        { id: 'name', label: 'Class Designation', minWidth: 170 },
    ];

    const sclassRows = sclassesList?.map((sclass) => ({
        name: sclass.sclassName,
        id: sclass._id,
    }));

    const SclassButtonHaver = ({ row }) => {
        const actions = [
            { icon: <PostAddIcon fontSize="small" />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
            { icon: <PersonAddAlt1Icon fontSize="small" />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
        ];
        return (
            <ActionContainer>
                <IconButton onClick={() => deleteHandler(row.id, "Sclass")}>
                    <DeleteIcon color="error" fontSize="small" />
                </IconButton>
                <ClassicViewButton onClick={() => navigate("/Admin/classes/class/" + row.id)}>
                    <VisibilityIcon fontSize="inherit" sx={{ mr: 1 }} /> View Ledger
                </ClassicViewButton>
                <ActionMenu actions={actions} />
            </ActionContainer>
        );
    };

    const ActionMenu = ({ actions }) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);

        return (
            <>
                <Tooltip title="Management Options">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                        <StyledAddText>Modify</StyledAddText>
                        <SpeedDialIcon sx={{ fontSize: 18, color: '#7d6b5d' }} />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{ elevation: 0, sx: styles.classicMenu }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {actions.map((action, index) => (
                        <ClassicMenuItem key={index} onClick={action.action}>
                            <ListItemIcon sx={{ color: '#7d6b5d' }}>{action.icon}</ListItemIcon>
                            {action.name}
                        </ClassicMenuItem>
                    ))}
                </Menu>
            </>
        );
    };

    const speedDialActions = [
        { icon: <AddCardIcon />, name: 'Establish New Class', action: () => navigate("/Admin/addclass") },
        { icon: <DeleteIcon />, name: 'Purge All Records', action: () => deleteHandler(adminID, "Sclasses") },
    ];

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Class Registry</TypographyClassic>
                    <TypographySubtitle>Index of all active academic groups and designations</TypographySubtitle>
                </Box>
                {sclassesList && sclassesList.length > 0 && (
                    <Classic3DButton onClick={() => navigate("/Admin/addclass")}>
                        + Add Designation
                    </Classic3DButton>
                )}
            </RegistryHeader>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <>
                    {getresponse ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>No classes recorded in the registry.</Typography>
                            <Classic3DButton onClick={() => navigate("/Admin/addclass")}>
                                Establish First Class
                            </Classic3DButton>
                        </EmptyState>
                    ) : (
                        <TableWrapper>
                            {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
                            )}
                            <SpeedDialTemplate actions={speedDialActions} />
                        </TableWrapper>
                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </RegistryContainer>
    );
};

export default ShowClasses;

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
        }
    }
`;

const ActionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
`;

const ClassicViewButton = styled.button`
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

const StyledAddText = styled.span`
    font-family: serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    margin-right: 8px;
    color: #7d6b5d;
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
    padding: 60px;
    border: 1px dashed #e0dcd0;
    background-color: #fdfcf8;
`;

const ClassicMenuItem = styled(MenuItem)`
    && {
        font-family: 'Georgia', serif;
        font-size: 0.9rem;
        color: #1a1a1a;
        padding: 10px 20px;
        &:hover { background-color: #f9f7f2; }
    }
`;

const styles = {
    classicMenu: {
        borderRadius: 0,
        border: '1px solid #e0dcd0',
        boxShadow: '6px 6px 0px rgba(0,0,0,0.05)',
        mt: 1,
    }
};