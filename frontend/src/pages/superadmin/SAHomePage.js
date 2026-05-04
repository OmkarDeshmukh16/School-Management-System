import React, { useEffect, useState } from 'react';
import { Grid, Box, CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import styled from 'styled-components';
import axios from 'axios';
import { BASEURL } from '../../utils/apiConfig';

const SAHomePage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.get(`${BASEURL}/SuperAdmin/Dashboard`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                <CircularProgress sx={{ color: '#1a1a1a' }} />
            </Box>
        );
    }

    const statCards = [
        { label: 'Total Schools', value: stats?.totalSchools || 0, icon: <SchoolIcon />, color: '#1a1a1a' },
        { label: 'Active Schools', value: stats?.activeSchools || 0, icon: <CheckCircleIcon />, color: '#2e7d32' },
        { label: 'Inactive Schools', value: stats?.inactiveSchools || 0, icon: <CancelIcon />, color: '#c62828' },
        { label: 'Total Students', value: stats?.totalStudents || 0, icon: <PeopleIcon />, color: '#1565c0' },
        { label: 'Total Teachers', value: stats?.totalTeachers || 0, icon: <PersonIcon />, color: '#6a1b9a' },
        { label: 'Pending Demos', value: stats?.pendingDemos || 0, icon: <PendingActionsIcon />, color: '#e65100' },
        { label: 'Total Demos', value: stats?.totalDemos || 0, icon: <ContactMailIcon />, color: '#7d6b5d' },
    ];

    return (
        <div>
            <PageHeader>
                <PageTitle>Platform Overview</PageTitle>
                <PageSubtitle>Real-time statistics across all registered institutions</PageSubtitle>
            </PageHeader>

            <Grid container spacing={3}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <StatCard>
                            <CardIconWrapper style={{ backgroundColor: card.color }}>
                                {React.cloneElement(card.icon, { sx: { fontSize: 28, color: '#fff' } })}
                            </CardIconWrapper>
                            <CardContent>
                                <CardValue>{card.value}</CardValue>
                                <CardLabel>{card.label}</CardLabel>
                            </CardContent>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default SAHomePage;

// --- STYLED COMPONENTS ---

const PageHeader = styled.div`
    margin-bottom: 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 15px;
`;

const PageTitle = styled.h1`
    font-family: 'Georgia', serif;
    font-size: 1.8rem;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 8px 0;
    font-weight: 400;
`;

const PageSubtitle = styled.p`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
    font-size: 0.9rem;
    margin: 0;
`;

const StatCard = styled.div`
    background: white;
    border: 1px solid #e0dcd0;
    padding: 25px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 4px 4px 0px #e0dcd0;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-4px);
        box-shadow: 6px 6px 0px #7d6b5d;
        border-color: #1a1a1a;
    }
`;

const CardIconWrapper = styled.div`
    width: 55px;
    height: 55px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const CardContent = styled.div``;

const CardValue = styled.h2`
    font-family: 'Georgia', serif;
    font-size: 2rem;
    color: #1a1a1a;
    margin: 0;
    line-height: 1;
`;

const CardLabel = styled.p`
    font-family: serif;
    font-size: 0.85rem;
    color: #7d6b5d;
    margin: 5px 0 0 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;
