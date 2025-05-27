import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUniversity,
  FaToggleOn,
  FaToggleOff,
  FaBuilding
} from 'react-icons/fa';

const CollegeDetails = () => {
  const { id: collegeId } = useParams();
  const navigate = useNavigate();
  
  const [college, setCollege] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchCollegeAndDepartments();
  }, [collegeId]);

  const fetchCollegeAndDepartments = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch college details and departments
      const [collegeResponse, departmentsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/admin/colleges/${collegeId}`, config),
        axios.get(`http://localhost:5000/api/admin/colleges/${collegeId}/departments`, config)
      ]);

      if (collegeResponse.data.success) {
        setCollege(collegeResponse.data.data);
      }

      if (departmentsResponse.data.success) {
        setDepartments(departmentsResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (editingDepartment) {
        // Update existing department
        const response = await axios.put(
          `http://localhost:5000/api/admin/colleges/departments/${editingDepartment._id}`,
          formData,
          config
        );
        
        if (response.data.success) {
          alert('Department updated successfully!');
          fetchCollegeAndDepartments();
        }
      } else {
        // Create new department
        const response = await axios.post(
          `http://localhost:5000/api/admin/colleges/${collegeId}/departments`,
          formData,
          config
        );
        
        if (response.data.success) {
          alert('Department created successfully!');
          fetchCollegeAndDepartments();
        }
      }
      
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || '',
      isActive: department.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const token = sessionStorage.getItem('adminToken');
        const response = await axios.delete(
          `http://localhost:5000/api/admin/colleges/departments/${departmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data.success) {
          alert('Department deleted successfully!');
          fetchCollegeAndDepartments();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Delete operation failed');
      }
    }
  };

  const handleToggleStatus = async (departmentId) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.patch(
        `http://localhost:5000/api/admin/colleges/departments/${departmentId}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        alert(response.data.message);
        fetchCollegeAndDepartments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', isActive: true });
    setEditingDepartment(null);
    setShowModal(false);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading college details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/admin/colleges')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800">College Details</h2>
                <p className="text-gray-600 mt-1">Manage departments and college information</p>
              </div>
            </div>

            {/* College Information Card */}
            {college && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                  <FaUniversity className="text-3xl text-blue-600 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{college.name}</h3>
                    <p className="text-gray-600">College Code: <span className="font-mono font-semibold">{college.code}</span></p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(college.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Departments Section */}
            <div className="bg-white rounded-lg shadow-md">
              {/* Departments Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <FaBuilding className="text-2xl text-green-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Departments</h3>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaPlus /> Add Department
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search departments by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Departments Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          {searchTerm ? 'No departments found matching your search.' : 'No departments available. Add your first department!'}
                        </td>
                      </tr>
                    ) : (
                      filteredDepartments.map((department) => (
                        <tr key={department._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{department.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">{department.code}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {department.description || 'No description'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              department.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {department.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(department.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(department)}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors"
                                title="Edit Department"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(department._id)}
                                className={`p-2 rounded transition-colors ${
                                  department.isActive 
                                    ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={department.isActive ? 'Deactivate Department' : 'Activate Department'}
                              >
                                {department.isActive ? <FaToggleOn /> : <FaToggleOff />}
                              </button>
                              <button
                                onClick={() => handleDelete(department._id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
                                title="Delete Department"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Statistics */}
              <div className="p-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{departments.length}</div>
                    <div className="text-sm text-blue-600">Total Departments</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {departments.filter(d => d.isActive).length}
                    </div>
                    <div className="text-sm text-green-600">Active Departments</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {departments.filter(d => !d.isActive).length}
                    </div>
                    <div className="text-sm text-red-600">Inactive Departments</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{filteredDepartments.length}</div>
                    <div className="text-sm text-purple-600">Filtered Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Add/Edit Department */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter department name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                  placeholder="Enter department code (e.g., CS, EE, ME)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Code will be automatically converted to uppercase
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter department description (optional)"
                  rows="3"
                />
              </div>

              {editingDepartment && (
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Department</span>
                  </label>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingDepartment ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDetails;
