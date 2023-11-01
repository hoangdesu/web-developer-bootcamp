import axios from 'axios';

// custom axios configs - to replace dev proxy server
export default axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});
