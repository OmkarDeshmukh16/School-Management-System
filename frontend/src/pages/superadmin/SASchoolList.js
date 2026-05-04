import React, { useEffect, useState } from 'react';
import {
    Box, CircularProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Switch, Select, MenuItem, Tooltip, IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import styled from 'styled-components';
import axios from 'axios';
import { BASEURL } from '../../utils/apiConfig';

const SASchoolList = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchSchools(); }, []);

    const getAuth = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return { Authorization: `Bearer ${user?.token}` };
    };

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASEURL}/SuperAdmin/Schools`, { headers: getAuth() });
            setSchools(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleToggle = async (id) => {
        try {
            const res = await axios.put(`${BASEURL}/SuperAdmin/School/${id}/toggle`, {}, { headers: getAuth() });
            setSchools(p => p.map(s => s._id === id ? { ...s, isActive: res.data.isActive } : s));
        } catch (e) { console.error(e); }
    };

    const handlePlan = async (id, plan) => {
        try {
            await axios.put(`${BASEURL}/SuperAdmin/School/${id}/plan`, { plan }, { headers: getAuth() });
            setSchools(p => p.map(s => s._id === id ? { ...s, plan } : s));
        } catch (e) { console.error(e); }
    };

    if (loading) return <Box sx={{ display:'flex', justifyContent:'center', pt:10 }}><CircularProgress sx={{ color:'#1a1a1a' }} /></Box>;

    return (
        <div>
            <PageHeader>
                <div>
                    <PageTitle>All Schools</PageTitle>
                    <PageSubtitle>{schools.length} institution{schools.length !== 1 ? 's' : ''} registered</PageSubtitle>
                </div>
                <Tooltip title="Refresh"><RefreshBtn onClick={fetchSchools}><RefreshIcon /></RefreshBtn></Tooltip>
            </PageHeader>

            {schools.length === 0 ? (
                <EmptyState><EmptyText>No schools yet. Create one from the sidebar.</EmptyText></EmptyState>
            ) : (
                <StyledTableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <HRow>
                                <HCell>#</HCell><HCell>School ID</HCell><HCell>School Name</HCell>
                                <HCell>Admin</HCell><HCell>Email</HCell><HCell>Students</HCell>
                                <HCell>Teachers</HCell><HCell>Plan</HCell><HCell>Status</HCell><HCell>Created</HCell>
                            </HRow>
                        </TableHead>
                        <TableBody>
                            {schools.map((s, i) => (
                                <SRow key={s._id}>
                                    <SCell>{i + 1}</SCell>
                                    <SCell><IdChip>{s.schoolId || '—'}</IdChip></SCell>
                                    <SCell><strong>{s.schoolName}</strong></SCell>
                                    <SCell>{s.name}</SCell>
                                    <SCell>{s.email}</SCell>
                                    <SCell><b>{s.studentCount || 0}</b></SCell>
                                    <SCell><b>{s.teacherCount || 0}</b></SCell>
                                    <SCell>
                                        <Select value={s.plan || 'free'} onChange={(e) => handlePlan(s._id, e.target.value)} size="small"
                                            sx={{ fontFamily:"'Georgia',serif", fontSize:'0.8rem', borderRadius:0,
                                                textTransform:'capitalize', '& .MuiSelect-select':{py:0.5,px:1}, '& fieldset':{borderColor:'#e0dcd0'} }}>
                                            <MenuItem value="free">Free</MenuItem>
                                            <MenuItem value="foundation">Foundation</MenuItem>
                                            <MenuItem value="professional">Professional</MenuItem>
                                            <MenuItem value="enterprise">Enterprise</MenuItem>
                                        </Select>
                                    </SCell>
                                    <SCell>
                                        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                                            <Switch checked={s.isActive !== false} onChange={() => handleToggle(s._id)} size="small"
                                                sx={{ '& .MuiSwitch-switchBase.Mui-checked':{color:'#2e7d32'},
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':{backgroundColor:'#2e7d32'} }} />
                                            <StatusText $active={s.isActive !== false}>
                                                {s.isActive !== false ? 'Active' : 'Inactive'}
                                            </StatusText>
                                        </Box>
                                    </SCell>
                                    <SCell>{s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</SCell>
                                </SRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            )}
        </div>
    );
};

export default SASchoolList;

const PageHeader = styled.div`margin-bottom:30px;border-bottom:2px solid #1a1a1a;padding-bottom:15px;display:flex;justify-content:space-between;align-items:flex-end;`;
const PageTitle = styled.h1`font-family:'Georgia',serif;font-size:1.8rem;color:#1a1a1a;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px 0;font-weight:400;`;
const PageSubtitle = styled.p`font-family:serif;font-style:italic;color:#7d6b5d;font-size:0.9rem;margin:0;`;
const RefreshBtn = styled(IconButton)`&&{border:1px solid #e0dcd0;border-radius:0;color:#1a1a1a;&:hover{background-color:#f4f1ea;}}`;
const StyledTableContainer = styled(TableContainer)`&&{border:1px solid #e0dcd0;border-radius:0;box-shadow:4px 4px 0px #e0dcd0;overflow-x:auto;}`;
const HRow = styled(TableRow)`&&{background-color:#1a1a1a;}`;
const HCell = styled(TableCell)`&&{color:#fff;font-family:'Georgia',serif;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;border-bottom:none;padding:14px 12px;white-space:nowrap;}`;
const SRow = styled(TableRow)`&&{&:nth-of-type(even){background-color:#fdfcf8;}&:hover{background-color:#f4f1ea;}}`;
const SCell = styled(TableCell)`&&{font-family:'Georgia',serif;font-size:0.85rem;color:#333;padding:10px 12px;border-bottom:1px solid #f0ece4;white-space:nowrap;}`;
const IdChip = styled.span`background-color:#f4f1ea;border:1px solid #e0dcd0;padding:3px 10px;font-family:'Courier New',monospace;font-size:0.78rem;color:#7d6b5d;`;
const StatusText = styled.span`font-family:serif;font-size:0.8rem;font-weight:600;color:${p => p.$active ? '#2e7d32' : '#c62828'};`;
const EmptyState = styled.div`text-align:center;padding:60px;border:1px dashed #e0dcd0;`;
const EmptyText = styled.p`font-family:serif;font-style:italic;color:#7d6b5d;font-size:1.1rem;`;
