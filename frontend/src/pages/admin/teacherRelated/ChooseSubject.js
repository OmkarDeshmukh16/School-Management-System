import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableContainer, TableHead, Typography, Paper, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import styled from 'styled-components';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false)

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            setClassID(params.id);
            dispatch(getTeacherFreeClassSubjects(params.id));
        }
        else if (situation === "Teacher") {
            const { classID, teacherID } = params
            setClassID(classID);
            setTeacherID(teacherID);
            dispatch(getTeacherFreeClassSubjects(classID));
        }
    }, [situation, params, dispatch]);

    if (error) {
        console.log(error)
    }

    const updateSubjectHandler = (teacherId, teachSubject) => {
        setLoader(true)
        dispatch(updateTeachSubject(teacherId, teachSubject))
        navigate("/Admin/teachers")
    }

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Subject Selection Registry</TypographyClassic>
                    <TypographySubtitle>Identify unassigned academic disciplines for faculty appointment</TypographySubtitle>
                </Box>
            </RegistryHeader>

            {loading ? (
                <LoaderContainer>
                    <CircularProgress color="inherit" />
                </LoaderContainer>
            ) : response ? (
                <EmptyState>
                    <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', mb: 2 }}>
                        All subjects currently have assigned faculty.
                    </Typography>
                    <Classic3DButton onClick={() => navigate("/Admin/addsubject/" + classID)}>
                        Establish New Subject
                    </Classic3DButton>
                </EmptyState>
            ) : (
                <TableWrapper>
                    <TableContainer>
                        <Table aria-label="subjects registry">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell align="center">Index</StyledTableCell>
                                    <StyledTableCell align="center">Subject Designation</StyledTableCell>
                                    <StyledTableCell align="center">Course Code</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(subjectsList) && subjectsList.length > 0 && subjectsList.map((subject, index) => (
                                    <StyledTableRow key={subject._id}>
                                        <StyledTableCell align="center" sx={{ fontFamily: 'serif' }}>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontFamily: 'serif' }}>{subject.subName}</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontFamily: 'serif' }}>{subject.subCode}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <ClassicSmallButton 
                                                disabled={loader}
                                                onClick={() => {
                                                    if (situation === "Norm") {
                                                        navigate("/Admin/teachers/addteacher/" + subject._id);
                                                    } else {
                                                        updateSubjectHandler(teacherID, subject._id);
                                                    }
                                                }}
                                            >
                                                {loader ? <CircularProgress size={16} color="inherit" /> : "Appoint Faculty"}
                                            </ClassicSmallButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TableWrapper>
            )}
        </RegistryContainer>
    );
};

export default ChooseSubject;

// --- CLASSIC STYLED COMPONENTS ---

const RegistryContainer = styled(Box)`
    padding: 20px;
    background-color: #f9f7f2;
    min-height: 90vh;
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
            color: #444;
        }
    }
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
    
    &:disabled {
        border-color: #ccc;
        color: #ccc;
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
`;