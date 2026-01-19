import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Box, IconButton, Typography, CircularProgress
} from '@mui/material';
import styled from 'styled-components';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Administrative restriction: Manual deletion of faculty records is currently disabled.");
        setShowPopup(true);
    };

    const columns = [
        { id: 'name', label: 'Faculty Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Department/Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Assigned Class', minWidth: 170 },
    ];

    const rows = teachersList?.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon />, name: 'Appoint New Faculty',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon />, name: 'Purge Faculty List',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Faculty Registry</TypographyClassic>
                    <TypographySubtitle>A formal index of institutional educators and their assignments</TypographySubtitle>
                </Box>
                {!response && (
                    <Classic3DButton onClick={() => navigate("/Admin/teachers/chooseclass")}>
                        + Appoint Teacher
                    </Classic3DButton>
                )}
            </RegistryHeader>

            {loading ? (
                <LoaderContainer>
                    <CircularProgress color="inherit" />
                </LoaderContainer>
            ) : response ? (
                <EmptyState>
                    <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>
                        No faculty members currently recorded in the ledger.
                    </Typography>
                    <Classic3DButton onClick={() => navigate("/Admin/teachers/chooseclass")}>
                        Appoint First Faculty
                    </Classic3DButton>
                </EmptyState>
            ) : (
                <TableWrapper>
                    <TableContainer>
                        <Table stickyHeader aria-label="faculty table">
                            <TableHead>
                                <StyledTableRow>
                                    {columns.map((column) => (
                                        <StyledTableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <StyledTableRow hover tabIndex={-1} key={row.id}>
                                            <StyledTableCell sx={{ fontFamily: 'serif' }}>{row.name}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.teachSubject ? (
                                                    <Typography sx={{ fontFamily: 'serif', fontSize: '0.9rem' }}>{row.teachSubject}</Typography>
                                                ) : (
                                                    <ClassicSmallButton 
                                                        onClick={() => navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)}
                                                    >
                                                        Assign Subject
                                                    </ClassicSmallButton>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ fontFamily: 'serif' }}>{row.teachSclass}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <IconButton onClick={() => deleteHandler(row.id, "Teacher")}>
                                                    <PersonRemoveIcon color="error" fontSize="small" />
                                                </IconButton>
                                                <ClassicSmallButton 
                                                    onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    <VisibilityIcon fontSize="inherit" sx={{ mr: 1 }} /> View File
                                                </ClassicSmallButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        sx={{ borderTop: '1px solid #e0dcd0', fontFamily: 'serif' }}
                    />
                </TableWrapper>
            )}

            <SpeedDialTemplate actions={actions} />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </RegistryContainer>
    );
};

export default ShowTeachers;

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
    }
`;

const ClassicSmallButton = styled.button`
    background: none;
    border: 1px solid #1a1a1a;
    color: #1a1a1a;
    padding: 6px 12px;
    font-family: serif;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
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