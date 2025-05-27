import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // <-- changed to include /api
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,  // Add this to include cookies by default
});

// Create authenticated API instance
const authAPI = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include auth token
authAPI.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { authAPI };