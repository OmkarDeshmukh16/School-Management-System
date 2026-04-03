import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Paper, Typography, FormControl, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import axios from 'axios';
import { BASEURL } from '../../../utils/apiConfig';
import styled from 'styled-components';
import TableTemplate from '../../../components/TableTemplate';

const StudentFilter = () => {
    const dispatch = useDispatch();
    const { sclassesList, loading: classLoading } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);

    const [selectedClass, setSelectedClass] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [dispatch, currentUser._id]);

    const handleClassChange = async (event) => {
        const classId = event.target.value;
        setSelectedClass(classId);
        setLoading(true);
        try {
            const res = await axios.get(`${BASEURL}/Sclass/Students/${classId}`);
            setStudents(res.data);
        } catch (err) {
            setStudents([]);
        }
        setLoading(false);
    };

    const studentColumns = [
        { id: 'name', label: 'Scholar Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'gender', label: 'Gender', minWidth: 100 },
    ];

    const studentRows = students.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        gender: student.gender || "N/A",
        id: student._id,
    }));

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <DossierPaper elevation={0}>
                <HeaderSection>
                    <ClassicTitle variant="h4">Cohort Explorer</ClassicTitle>
                    <ClassicSubtitle>Filter and audit scholars by academic class designation</ClassicSubtitle>
                </HeaderSection>

                <Box sx={{ mb: 5, maxWidth: 400 }}>
                    <LabelText>Select Academic Cohort</LabelText>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <ClassicSelect
                            value={selectedClass}
                            onChange={handleClassChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled><em>Choose a class...</em></MenuItem>
                            {sclassesList?.map((sclass) => (
                                <MenuItem key={sclass._id} value={sclass._id}>
                                    {sclass.sclassName}
                                </MenuItem>
                            ))}
                        </ClassicSelect>
                    </FormControl>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={5}><CircularProgress color="inherit" /></Box>
                ) : (
                    selectedClass && (
                        <TableWrapper>
                            <TableTemplate columns={studentColumns} rows={studentRows} />
                        </TableWrapper>
                    )
                )}
            </DossierPaper>
        </Container>
    );
};

export default StudentFilter;

// --- CLASSIC STYLED COMPONENTS ---

const DossierPaper = styled(Paper)`
    && {
        padding: 50px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 10px 10px 0px #e0dcd0;
    }
`;

const HeaderSection = styled(Box)`
    margin-bottom: 30px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 15px;
`;

const ClassicTitle = styled(Typography)`
    && { font-family: 'Georgia', serif; text-transform: uppercase; letter-spacing: 1px; color: #1a1a1a; }
`;

const ClassicSubtitle = styled(Typography)`
    && { font-family: serif; font-style: italic; color: #7d6b5d; font-size: 0.95rem; }
`;

const LabelText = styled.p`
    font-family: serif; font-size: 0.75rem; text-transform: uppercase; color: #7d6b5d; font-weight: bold; margin: 0;
`;

const ClassicSelect = styled(Select)`
    &.MuiOutlinedInput-root {
        border-radius: 0;
        font-family: 'Georgia', serif;
        & fieldset { border-color: #e0dcd0; }
        &.Mui-focused fieldset { border-color: #1a1a1a; }
    }
`;

const TableWrapper = styled(Box)`
    border: 1px solid #e0dcd0;
    & .MuiTableCell-head {
        background-color: #1a1a1a !important;
        color: white !important;
        font-family: 'Georgia', serif !important;
        text-transform: uppercase;
    }
`;