import * as React from 'react';
import { useDispatch } from 'react-redux';
import { underControl } from '../redux/userRelated/userSlice';
import { underStudentControl } from '../redux/studentRelated/studentSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styled from 'styled-components';

const Popup = ({ message, setShowPopup, showPopup, showConfirm, onConfirm }) => {
    const dispatch = useDispatch();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowPopup(false);
        dispatch(underControl())
        dispatch(underStudentControl())
    };

    return (
        <>
            <Dialog
            open={showPopup}
            onClose={handleClose}
            PaperProps={{
                style: {
                    borderRadius: 0,
                    border: '1px solid #e0dcd0',
                    boxShadow: '8px 8px 0px #7d6b5d',
                    padding: '10px'
                }
            }}
        >
            <DialogTitle sx={{ fontFamily: 'Georgia, serif', textTransform: 'uppercase', fontSize: '1rem' }}>
                System Notification
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontFamily: 'serif', color: '#1a1a1a' }}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ClassicOutlineButton onClick={handleClose}>
                    {showConfirm ? "Cancel" : "Close"}
                </ClassicOutlineButton>
                
                {showConfirm && (
                    <Confirm3DButton onClick={onConfirm}>
                        Confirm Authorization
                    </Confirm3DButton>
                )}
            </DialogActions>
        </Dialog>
        </>
    );
};

export default Popup;

const ClassicOutlineButton = styled.button`
    background: none; border: 1px solid #1a1a1a; color: #1a1a1a;
    padding: 8px 16px; font-family: serif; text-transform: uppercase;
    font-size: 0.7rem; cursor: pointer;
    &:hover { background-color: #f9f7f2; }
`;

const Confirm3DButton = styled.button`
    background-color: #d32f2f; color: white; border: none;
    padding: 8px 16px; font-family: 'Georgia', serif; text-transform: uppercase;
    font-size: 0.7rem; box-shadow: 3px 3px 0px #7d1c1c; cursor: pointer;
    &:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0px #7d1c1c; }
`;