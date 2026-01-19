import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { Box, IconButton, Paper, Typography, CircularProgress, Button, ButtonGroup, ClickAwayListener, Grow, Popper, MenuItem, MenuList } from '@mui/material';
import styled from 'styled-components';

// Icons
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Components
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = () => {
        setMessage("Administrative restriction: Manual deletion of scholar records is currently disabled.");
        setShowPopup(true);
    };

    const studentColumns = [
        { id: 'name', label: 'Scholar Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
        { id: 'sclassName', label: 'Designated Class', minWidth: 170 },
    ];

    const studentRows = studentsList?.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        sclassName: student.sclassName.sclassName,
        id: student._id,
    }));

    const StudentButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];
        const [open, setOpen] = useState(false);
        const anchorRef = useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) navigate("/Admin/students/student/attendance/" + row.id);
            else if (selectedIndex === 1) navigate("/Admin/students/student/marks/" + row.id);
        };

        return (
            <ActionContainer>
                <IconButton onClick={deleteHandler}>
                    <PersonRemoveIcon color="error" fontSize="small" />
                </IconButton>
                
                <ClassicSmallButton onClick={() => navigate("/Admin/students/student/" + row.id)}>
                    <VisibilityIcon fontSize="inherit" sx={{ mr: 1 }} /> View File
                </ClassicSmallButton>

                <Fragment>
                    <StyledButtonGroup variant="outlined" ref={anchorRef}>
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <Button
                            size="small"
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </Button>
                    </StyledButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} transition disablePortal sx={{ zIndex: 10 }}>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                                <Paper sx={styles.classicMenu}>
                                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                                        <MenuList id="split-button-menu">
                                            {options.map((option, index) => (
                                                <ClassicMenuItem
                                                    key={option}
                                                    selected={index === selectedIndex}
                                                    onClick={() => {
                                                        setSelectedIndex(index);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {option}
                                                </ClassicMenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Fragment>
            </ActionContainer>
        );
    };

    const actions = [
        { icon: <PersonAddAlt1Icon />, name: 'Enroll Scholar', action: () => navigate("/Admin/addstudents") },
        { icon: <PersonRemoveIcon />, name: 'Purge Registry', action: deleteHandler },
    ];

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Student Registry</TypographyClassic>
                    <TypographySubtitle>A comprehensive index of enrolled scholars and academic standings</TypographySubtitle>
                </Box>
                {studentsList && studentsList.length > 0 && (
                    <Classic3DButton onClick={() => navigate("/Admin/addstudents")}>
                        Enroll Scholar
                    </Classic3DButton>
                )}
            </RegistryHeader>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress color="inherit" /></Box>
            ) : (
                <TableWrapper>
                    {response ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ fontFamily: 'serif' }}>No scholars found in the current directory.</Typography>
                        </EmptyState>
                    ) : (
                        <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
                    )}
                    <SpeedDialTemplate actions={actions} />
                </TableWrapper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </RegistryContainer>
    );
};

export default ShowStudents;

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
        border-radius: 0; border: 1px solid #e0dcd0; box-shadow: none;
        & .MuiTableCell-head {
            background-color: #1a1a1a; color: white;
            font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px;
        }
    }
`;

const ActionContainer = styled.div`
    display: flex; align-items: center; gap: 1rem;
`;

const ClassicSmallButton = styled.button`
    background: none; border: 1px solid #1a1a1a; color: #1a1a1a;
    padding: 6px 12px; font-family: serif; text-transform: uppercase;
    font-size: 0.7rem; letter-spacing: 1px; cursor: pointer;
    &:hover { background-color: #1a1a1a; color: white; }
`;

const StyledButtonGroup = styled(ButtonGroup)`
    & .MuiButton-root {
        border-radius: 0; font-family: serif; font-size: 0.7rem;
        text-transform: uppercase; color: #1a1a1a; border-color: #1a1a1a;
        &:hover { border-color: #1a1a1a; background-color: #f9f7f2; }
    }
`;

const Classic3DButton = styled.button`
    background-color: #1a1a1a; color: white; border: none;
    padding: 12px 24px; font-family: 'Georgia', serif; text-transform: uppercase;
    box-shadow: 4px 4px 0px #7d6b5d; cursor: pointer;
    &:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #7d6b5d; }
`;

const EmptyState = styled(Box)`
    text-align: center; padding: 60px; background-color: #fdfcf8;
`;

const ClassicMenuItem = styled(MenuItem)`
    && {
        font-family: 'Georgia', serif; font-size: 0.85rem;
        &.Mui-selected { background-color: #f4f1ea; color: #1a1a1a; }
    }
`;

const styles = {
    classicMenu: {
        borderRadius: 0, border: '1px solid #e0dcd0', boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
    }
};