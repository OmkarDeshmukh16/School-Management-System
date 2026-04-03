import axios from 'axios';

// Backend serves frontend from the same origin on Render,
// so API calls should be relative (empty base URL).
// Only set REACT_APP_BASE_URL if frontend and backend are on different domains.
const rawURL = process.env.REACT_APP_BASE_URL ?? '';
// Strip any stray quotes that might get injected from env config
const BASEURL = rawURL.replace(/['"]+/g, '').trim();

const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { BASEURL };
export default axiosInstance;
