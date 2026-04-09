import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Typography, Paper, CircularProgress } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import TableTemplate from '../../../components/TableTemplate';
import styled from 'styled-components';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

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

  const deleteHandler = () => {
    setMessage("Administrative restriction: Manual removal of class designations is currently disabled.");
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
      { icon: <PostAddIcon fontSize="small" />, name: 'Assign Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon fontSize="small" />, name: 'Enroll Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <ActionContainer>
        <IconButton onClick={deleteHandler}>
          <DeleteIcon color="error" fontSize="small" />
        </IconButton>
        
        <ClassicSmallButton onClick={() => navigate("/Admin/classes/class/" + row.id)}>
          <VisibilityIcon fontSize="inherit" sx={{ mr: 1 }} /> View Ledger
        </ClassicSmallButton>

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
          <MenuTriggerButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            Manage <SpeedDialIcon sx={{ fontSize: 16, ml: 1 }} />
          </MenuTriggerButton>
        </Tooltip>
        <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action, index) => (
            <MenuItem key={index} onClick={action.action} sx={{ fontFamily: 'serif', fontSize: '0.85rem' }}>
              <ListItemIcon>{action.icon}</ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </StyledMenu>
      </>
    );
  };

  const speedDialActions = [
    { icon: <AddCardIcon />, name: 'Establish New Class', action: () => navigate("/Admin/addclass") },
    { icon: <DeleteIcon />, name: 'Purge Directory', action: () => deleteHandler() },
  ];

  return (
    <RegistryContainer>
      <RegistryHeader>
        <Box>
          <TypographyClassic variant="h4">Class Directory</TypographyClassic>
          <TypographySubtitle>Registry of active class designations and academic cohorts</TypographySubtitle>
        </Box>
        {!getresponse && (
          <Classic3DButton onClick={() => navigate("/Admin/addclass")}>
            Establish Class
          </Classic3DButton>
        )}
      </RegistryHeader>

      {loading ? (
        <LoaderContainer><CircularProgress color="inherit" /></LoaderContainer>
      ) : (
        <>
          {getresponse ? (
            <EmptyState>
              <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>No class designations currently recorded.</Typography>
              <Classic3DButton onClick={() => navigate("/Admin/addclass")}>Record First Class</Classic3DButton>
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
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const TypographySubtitle = styled.p`
  font-family: serif; font-style: italic; color: #7d6b5d; margin: 5px 0 0 0;
`;

const TableWrapper = styled(Paper)`
  && {
    border-radius: 0; border: 1px solid #e0dcd0; box-shadow: none; background-color: #ffffff;
    & .MuiTableCell-head {
      background-color: #1a1a1a; color: white;
      font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px;
    }
    & .MuiTableCell-body { font-family: 'serif'; }
  }
`;

const ActionContainer = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 1rem;
`;

const ClassicSmallButton = styled.button`
  background: none; border: 1px solid #1a1a1a; color: #1a1a1a; padding: 6px 12px;
  font-family: serif; text-transform: uppercase; font-size: 0.7rem; cursor: pointer;
  &:hover { background-color: #1a1a1a; color: white; }
`;

const MenuTriggerButton = styled.button`
  background: #f4f1ea; border: 1px solid #e0dcd0; color: #1a1a1a; padding: 6px 12px;
  font-family: serif; text-transform: uppercase; font-size: 0.7rem; cursor: pointer;
  display: flex; align-items: center;
  &:hover { border-color: #1a1a1a; }
`;

const Classic3DButton = styled.button`
  background-color: #1a1a1a; color: white; border: none; padding: 12px 24px;
  font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px;
  cursor: pointer; box-shadow: 4px 4px 0px #7d6b5d; transition: all 0.2s;
  &:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #7d6b5d; }
`;

const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    border-radius: 0; border: 1px solid #e0dcd0; box-shadow: 4px 4px 0px rgba(0,0,0,0.05);
  }
`;

const EmptyState = styled(Box)`
  text-align: center; padding: 80px 60px; border: 1px dashed #e0dcd0; background-color: #fdfcf8;
`;

const LoaderContainer = styled(Box)`
  display: flex; justify-content: center; align-items: center; padding: 100px;
`;