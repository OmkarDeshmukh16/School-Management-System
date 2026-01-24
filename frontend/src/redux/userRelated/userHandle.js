import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; // Fallback to 5000
        const result = await axios.post(`${baseURL}/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        if (!error.response) {
            // This happens when the server port is wrong or the server is down
            dispatch(authError("The server is currently unreachable. Please verify the connection."));
        } else {
            dispatch(authError(error.response.data.message || "Authentication failed."));
        }
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        // Add 'role' or 'name' check to confirm student registration success
        if (result.data.schoolName || result.data.role === "Student" || result.data.name) {
            dispatch(doneSuccess(result.data));
        }
        else if (result.data.school) {
            dispatch(stuffAdded());
        }
        else {
            // This is where "Student not found" is likely being pulled from result.data.message
            dispatch(authFailed(result.data.message || "Registration failed"));
        }
    } catch (error) {
        dispatch(authError(error.response?.data?.message || error.message || "An error occurred"));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || "An error occurred"));
    }
}

// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
//         if (result.data.message) {
//             dispatch(getFailed(result.data.message));
//         } else {
//             dispatch(getDeleteSuccess());
//         }
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }


export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(getFailed("Sorry the delete function has been disabled for now."));
}

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message || "An error occurred"));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${address}Create`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(error.response?.data?.message || error.message || "An error occurred"));
    }
};