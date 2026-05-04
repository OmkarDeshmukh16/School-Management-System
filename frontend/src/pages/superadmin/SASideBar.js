import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    List, ListItemButton, ListItemIcon, ListItemText,
    Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LogoutIcon from '@mui/icons-material/Logout';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { authLogout } from '../../redux/userRelated/userSlice';

const SASideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/SuperAdmin/dashboard' },
        { text: 'Demo Requests', icon: <ContactMailIcon />, path: '/SuperAdmin/demo-requests' },
        { text: 'All Schools', icon: <SchoolIcon />, path: '/SuperAdmin/schools' },
        { text: 'Create School', icon: <AddBusinessIcon />, path: '/SuperAdmin/create-school' },
    ];

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    return (
        <>
            <List>
                {menuItems.map((item) => (
                    <StyledListItem
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        $active={location.pathname === item.path}
                    >
                        <ListItemIcon sx={{
                            color: location.pathname === item.path ? '#1a1a1a' : '#7d6b5d',
                            minWidth: 40,
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontFamily: "'Georgia', serif",
                                fontSize: '0.9rem',
                                letterSpacing: '0.5px',
                                fontWeight: location.pathname === item.path ? 600 : 400,
                            }}
                        />
                    </StyledListItem>
                ))}
            </List>
            <Divider sx={{ borderColor: '#e0dcd0', my: 1 }} />
            <List>
                <StyledListItem onClick={handleLogout} $active={false}>
                    <ListItemIcon sx={{ color: '#c0392b', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            fontFamily: "'Georgia', serif",
                            fontSize: '0.9rem',
                            color: '#c0392b',
                        }}
                    />
                </StyledListItem>
            </List>
        </>
    );
};

export default SASideBar;

const StyledListItem = styled(ListItemButton)`
    && {
        padding: 10px 20px;
        border-left: 3px solid ${props => props.$active ? '#1a1a1a' : 'transparent'};
        background-color: ${props => props.$active ? '#f4f1ea' : 'transparent'};
        &:hover {
            background-color: #f4f1ea;
        }
    }
`;
