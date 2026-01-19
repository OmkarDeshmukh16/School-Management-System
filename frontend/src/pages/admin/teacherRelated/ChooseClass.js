import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material'
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TableTemplate from '../../../components/TableTemplate';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID)
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID)
        }
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Designation', minWidth: 170 },
    ]

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    })

    const SclassButtonHaver = ({ row }) => {
        return (
            <ActionContainer>
                <ClassicSmallButton onClick={() => navigateHandler(row.id)}>
                    Select Designation
                </ClassicSmallButton>
            </ActionContainer>
        );
    };

    return (
        <RegistryContainer>
            <RegistryHeader>
                <Box>
                    <TypographyClassic variant="h4">Select Academic Group</TypographyClassic>
                    <TypographySubtitle>Choose a designation to proceed with {situation.toLowerCase()} assignment</TypographySubtitle>
                </Box>
                {getresponse && (
                    <Classic3DButton onClick={() => navigate("/Admin/addclass")}>
                        Establish New Class
                    </Classic3DButton>
                )}
            </RegistryHeader>

            {loading ? (
                <LoaderContainer>
                    <CircularProgress color="inherit" />
                </LoaderContainer>
            ) : (
                <>
                    {getresponse ? (
                        <EmptyState>
                            <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>
                                No active classes found in the registry.
                            </Typography>
                            <Classic3DButton onClick={() => navigate("/Admin/addclass")}>
                                Record First Class
                            </Classic3DButton>
                        </EmptyState>
                    ) : (
                        <TableWrapper>
                            {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                                <TableTemplate 
                                    buttonHaver={SclassButtonHaver} 
                                    columns={sclassColumns} 
                                    rows={sclassRows} 
                                />
                            )}
                        </TableWrapper>
                    )}
                </>
            )}
        </RegistryContainer>
    )
}

export default ChooseClass

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
    justify-content: center;
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