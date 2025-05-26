import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // <-- changed to include /api
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,  // Add this to include cookies by default
});


// Example of using admin endpoints with authorization
const getColleges = () => {
  return api.get('/admin/colleges');
};

const createCollege = (collegeData) => {
  return api.post('/admin/colleges', collegeData);
};

const updateCollege = (id, collegeData) => {
  return api.put(`/admin/colleges/${id}`, collegeData);
};

const deleteCollege = (id) => {
  return api.delete(`/admin/colleges/${id}`);
};

export default api;
export { getColleges, createCollege, updateCollege, deleteCollege };