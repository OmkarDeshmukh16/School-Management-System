import axios from 'axios';

const BASEURL = process.env.REACT_APP_BASE_URL || '';

const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { BASEURL };
export default axiosInstance;
