import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,  // Add this to include cookies by default
});

export default api;