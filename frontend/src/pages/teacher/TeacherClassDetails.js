import { useEffect, useState, useRef, Fragment } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { 
    Paper, Box, Typography, ButtonGroup, Button, Popper, 
    Grow, ClickAwayListener, MenuList, MenuItem, CircularProgress 
} from '@mui/material';
import styled from "styled-components";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassStudents, loading, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    const studentColumns = [
        { id: 'name', label: 'Scholar Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = sclassStudents.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];
        const [open, setOpen] = useState(false);
        const anchorRef = useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`);
            else navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
        };

        return (
            <ActionContainer>
                <ClassicSmallButton onClick={() => navigate("/Teacher/class/student/" + row.id)}>
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

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Class Ledger</TypographyClassic>
                    <TypographySubtitle>
                        Faculty record for {currentUser.teachSclass?.sclassName} — {currentUser.teachSubject?.subName}
                    </TypographySubtitle>
                </Box>
            </RegistryHeader>

            {loading ? (
                <LoaderContainer>
                    <CircularProgress color="inherit" />
                </LoaderContainer>
            ) : (
                <TablePaper elevation={0}>
                    {getresponse ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ fontFamily: 'serif' }}>
                                No scholars currently recorded in this class registry.
                            </Typography>
                        </EmptyState>
                    ) : (
                        <>
                            <ListHeader variant="h5">Enrolled Scholars</ListHeader>
                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            )}
                        </>
                    )}
                </TablePaper>
            )}
        </RegistryContainer>
    );
};

export default TeacherClassDetails;

// --- CLASSIC STYLED COMPONENTS ---

const RegistryContainer = styled(Box)`
    padding: 20px;
`;

const RegistryHeader = styled(Box)`
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
        font-weight: 400;
    }
`;

const TypographySubtitle = styled.p`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
    margin: 5px 0 0 0;
`;

const TablePaper = styled(Paper)`
    && {
        padding: 30px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 6px 6px 0px #e0dcd0;

        & .MuiTableCell-head {
            background-color: #1a1a1a;
            color: white;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        & .MuiTableCell-body {
            font-family: 'serif';
        }
    }
`;

const ListHeader = styled(Typography)`
    && {
        font-family: 'Georgia', serif;
        margin-bottom: 20px;
        color: #1a1a1a;
        font-weight: 400;
    }
`;

const ActionContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    justify-content: center;
`;

const ClassicSmallButton = styled.button`
    background: none;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 6px 16px;
    font-family: serif;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #1a1a1a;
        color: white;
    }
`;

const StyledButtonGroup = styled(ButtonGroup)`
    & .MuiButton-root {
        border-radius: 0;
        font-family: serif;
        font-size: 0.7rem;
        text-transform: uppercase;
        color: #1a1a1a;
        border-color: #1a1a1a;
        &:hover {
            border-color: #1a1a1a;
            background-color: #f9f7f2;
        }
    }
`;

const ClassicMenuItem = styled(MenuItem)`
    && {
        font-family: 'Georgia', serif;
        font-size: 0.85rem;
        &.Mui-selected {
            background-color: #f4f1ea;
            color: #1a1a1a;
        }
    }
`;

const EmptyState = styled(Box)`
    text-align: center;
    padding: 40px;
    background-color: #fdfcf8;
`;

const LoaderContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px;
`;

const styles = {
    classicMenu: {
        borderRadius: 0,
        border: '1px solid #e0dcd0',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
    }
};