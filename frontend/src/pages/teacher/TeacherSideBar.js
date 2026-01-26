import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const TeacherSideBar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass;
    const location = useLocation();

    // Helper to determine if a route is active
    const isActive = (path) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

    return (
        <>
            <NavSection>
                <ClassicListItem
                    component={Link}
                    to="/"
                    $active={isActive("/") || location.pathname === "/Teacher/dashboard"}
                >
                    <ListItemIcon>
                        <HomeIcon fontSize="small" color="inherit" />
                    </ListItemIcon>
                    <ListItemText primary="Institutional Home" />
                </ClassicListItem>

                <ClassicListItem
                    component={Link}
                    to="/Teacher/class"
                    $active={isActive("/Teacher/class")}
                >
                    <ListItemIcon>
                        <ClassOutlinedIcon fontSize="small" color="inherit" />
                    </ListItemIcon>
                    <ListItemText primary={`Class Registry: ${sclassName?.sclassName}`} />
                </ClassicListItem>

                <ClassicListItem
                    component={Link}
                    to="/Teacher/complain"
                    $active={isActive("/Teacher/complain")}
                >
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon fontSize="small" color="inherit" />
                    </ListItemIcon>
                    <ListItemText primary="Grievance Submission" />
                </ClassicListItem>

                <ClassicListItem component={Link} to="/Teacher/marks">
                    <ListItemIcon>
                        <AssignmentTurnedInIcon color={location.pathname === "/Teacher/marks" ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Enter Marks" />
                </ClassicListItem>

                <ClassicListItem  component={Link} to="/Teacher/attendance">
                    <ListItemIcon>
                        <CheckCircleOutlineIcon color={location.pathname === "/Teacher/attendance" ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Mark Attendance" />
                </ClassicListItem>
            </NavSection>

            <Divider sx={{ my: 2, mx: 2, borderColor: '#e0dcd0' }} />

            <NavSection>
                <ClassicListSubheader component="div" inset>
                    Personnel Record
                </ClassicListSubheader>

                <ClassicListItem
                    component={Link}
                    to="/Teacher/profile"
                    $active={isActive("/Teacher/profile")}
                >
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon fontSize="small" color="inherit" />
                    </ListItemIcon>
                    <ListItemText primary="Faculty Profile" />
                </ClassicListItem>

                <ClassicListItem
                    component={Link}
                    to="/logout"
                    $active={isActive("/logout")}
                >
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" color="inherit" />
                    </ListItemIcon>
                    <ListItemText primary="Terminate Session" />
                </ClassicListItem>
            </NavSection>
        </>
    );
};

export default TeacherSideBar;

// --- CLASSIC STYLED COMPONENTS ---

const NavSection = styled.div`
    padding: 0 8px;
`;

const ClassicListItem = styled(ListItemButton)`
    && {
        margin: 4px 0;
        border-radius: 0; // Sharp architectural corners
        transition: all 0.2s ease;
        
        // Background logic
        background-color: ${props => props.$active ? '#1a1a1a' : 'transparent'};
        
        // Text and Icon logic
        color: ${props => props.$active ? '#ffffff' : '#7d6b5d'};
        & .MuiListItemIcon-root {
            color: ${props => props.$active ? '#ffffff' : '#7d6b5d'};
            min-width: 40px;
        }

        & .MuiListItemText-primary {
            font-family: 'serif';
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        &:hover {
            background-color: ${props => props.$active ? '#1a1a1a' : '#f4f1ea'};
            color: ${props => props.$active ? '#ffffff' : '#1a1a1a'};
            & .MuiListItemIcon-root {
                color: ${props => props.$active ? '#ffffff' : '#1a1a1a'};
            }
        }
    }
`;

const ClassicListSubheader = styled(ListSubheader)`
    && {
        background: transparent;
        font-family: 'Georgia', serif;
        font-style: italic;
        color: #1a1a1a;
        font-size: 0.75rem;
        text-transform: none;
        letter-spacing: 1px;
        padding-bottom: 8px;
    }
`;