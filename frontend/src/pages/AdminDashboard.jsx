import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userType, setUserType] = useState('student');
  const [excelFile, setExcelFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [users, setUsers] = useState([]);
    // New states for college management
  const [colleges, setColleges] = useState([]);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [collegeData, setCollegeData] = useState({
    name: '',
    code: '',
  });
  const [editingCollege, setEditingCollege] = useState(null);
  
  // Form states
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    program: '',
    branch: '',
    semester: ''
  });
  
  const [facultyData, setFacultyData] = useState({
    name: '',
    email: '',
    phone: '',
    isCoordinator: false
  });

  // Fetch users when Manage Users tab is active or after add/import
  useEffect(() => {
    if (activeTab === 'manageUsers') {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [activeTab, message]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/all-users');
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  // Compute counts for dashboard
  const totalUsers = users.length;
  const studentCount = users.filter(u => u.role === 'student').length;
  const facultyCount = users.filter(u => u.role === 'faculty').length;

  // Function to handle Excel file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setMessage({ text: 'Please select a file', type: 'error' });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', excelFile);
    formData.append('userType', userType);

    try {
      const response = await api.post('/auth/bulk-register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ 
        text: `Successfully imported ${response.data.count} ${userType}s`, 
        type: 'success' 
      });
      setExcelFile(null);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to import data', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle manual user addition
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = userType === 'student' ? {
        ...studentData,
        role: 'student',
        password: '123456' // Default password
      } : {
        ...facultyData,
        role: 'faculty',
        password: '123456' // Default password
      };

      await api.post('/auth/admin-register', userData);
      setMessage({ text: `${userType} added successfully`, type: 'success' });
      
      // Reset form
      if (userType === 'student') {
        setStudentData({
          name: '',
          email: '',
          phone: '',
          college: '',
          program: '',
          branch: '',
          semester: ''
        });
      } else {
        setFacultyData({
          name: '',
          email: '',
          phone: '',
          isCoordinator: false
        });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || `Failed to add ${userType}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch colleges when Manage Colleges tab is active
  useEffect(() => {
    if (activeTab === 'manageColleges') {
      fetchColleges();
    }
  }, [activeTab]);

  const fetchColleges = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint for fetching colleges
      const res = await api.get('/admin/colleges');
      setColleges(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
      setColleges([]);
      setIsLoading(false);
    }
  };

  // Handle college form input changes
  const handleCollegeChange = (e) => {
    const { name, value } = e.target;
    setCollegeData(prev => ({ ...prev, [name]: value }));
  };

  // Add new college
  const handleAddCollege = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingCollege) {
        // Update existing college
        await api.put(`/admin/colleges/${editingCollege._id}`, collegeData);
        setMessage({ text: 'College updated successfully', type: 'success' });
      } else {
        // Add new college
        await api.post('/admin/colleges', collegeData);
        setMessage({ text: 'College added successfully', type: 'success' });
      }
      
      // Reset form and refetch colleges
      setCollegeData({
        name: '',
        code: '',
      });
      setEditingCollege(null);
      setShowCollegeModal(false);
      fetchColleges();
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to save college', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit college
  const handleEditCollege = (college) => {
    setCollegeData({
      name: college.name || '',
      code: college.code || '',
      address: college.address || '',
      city: college.city || '',
      state: college.state || '',
      contactPerson: college.contactPerson || '',
      contactEmail: college.contactEmail || '',
      contactPhone: college.contactPhone || '',
    });
    setEditingCollege(college);
    setShowCollegeModal(true);
  };

  // Delete college
  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        setIsLoading(true);
        await api.delete(`/admin/colleges/${collegeId}`);
        setMessage({ text: 'College deleted successfully', type: 'success' });
        fetchColleges();
      } catch (error) {
        setMessage({ 
          text: error.response?.data?.message || 'Failed to delete college', 
          type: 'error' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Open college dashboard - navigate to separate page
  const openCollegeDashboard = (college) => {
    navigate(`/college-dashboard/${college._id}`);
  };

  // Handle input changes
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacultyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFacultyData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{user?.name}</span> (Admin)
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-md rounded-lg mb-6">
          <nav className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('manageUsers')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'manageUsers'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Manage Users
            </button>            <button
              onClick={() => setActiveTab('manageColleges')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'manageColleges'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Manage Colleges
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'reports'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Total Users</h3>
                  <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">Students</h3>
                  <div className="text-3xl font-bold text-green-600">{studentCount}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800">Faculty</h3>
                  <div className="text-3xl font-bold text-purple-600">{facultyCount}</div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Users Tab */}
          {activeTab === 'manageUsers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Add New User
                </button>
              </div>
              {/* User listing */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={5}>No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.userId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Manage Colleges Tab */}
          {activeTab === 'manageColleges' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Manage Colleges</h2>
                <button
                  onClick={() => {
                    setEditingCollege(null);
                    setCollegeData({
                      name: '',
                      code: '',
                      address: '',
                      city: '',
                      state: '',
                      contactPerson: '',
                      contactEmail: '',
                      contactPhone: '',
                    });
                    setShowCollegeModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Add New College
                </button>
              </div>
              
              {/* Message display */}
              {message.text && (
                <div className={`p-4 rounded ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
              
              {/* College listing */}
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colleges.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No colleges found. Add a new college to get started.
                    </div>
                  ) : (
                    colleges.map((college) => (
                      <div 
                        key={college._id} 
                        className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                      >
                        <div 
                          onClick={() => openCollegeDashboard(college)}
                          className="p-5 cursor-pointer"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">{college.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Code: {college.code}</p>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCollege(college);
                            }}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCollege(college._id);
                            }}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}          {/* Reports Tab - simplified for this example */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reports</h2>
              <p className="text-gray-600">Report features will be implemented here</p>
            </div>
          )}

          {/* Settings Tab - simplified for this example */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
              <p className="text-gray-600">System settings will be implemented here</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Add New {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Success or error message */}
              {message.text && (
                <div className={`p-4 mb-4 rounded ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              {/* User Type Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  User Type
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`px-4 py-2 rounded ${
                      userType === 'student'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('faculty')}
                    className={`px-4 py-2 rounded ${
                      userType === 'faculty'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Faculty
                  </button>
                </div>
              </div>

              {/* Excel Import */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Import from Excel
                </h4>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Excel file
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setExcelFile(e.target.files[0])}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? 'Importing...' : 'Import Data'}
                  </button>
                </form>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Manual Entry */}
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Add Manually
              </h4>
              
              {/* Student Form */}
              {userType === 'student' && (
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={studentData.name}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={studentData.email}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={studentData.phone}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">College</label>
                    <input
                      type="text"
                      name="college"
                      value={studentData.college}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program</label>
                    <input
                      type="text"
                      name="program"
                      value={studentData.program}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={studentData.branch}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <input
                      type="number"
                      name="semester"
                      value={studentData.semester}
                      onChange={handleStudentChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {isLoading ? 'Adding...' : 'Add Student'}
                  </button>
                </form>
              )}
              
              {/* Faculty Form */}
              {userType === 'faculty' && (
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={facultyData.name}
                      onChange={handleFacultyChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={facultyData.email}
                      onChange={handleFacultyChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={facultyData.phone}
                      onChange={handleFacultyChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isCoordinator"
                      id="isCoordinator"
                      checked={facultyData.isCoordinator}
                      onChange={handleFacultyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isCoordinator" className="ml-2 block text-sm text-gray-700">
                      Is Coordinator
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {isLoading ? 'Adding...' : 'Add Faculty'}
                  </button>
                </form>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <p>Note: Default password for new accounts is "123456"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit College Modal */}
      {showCollegeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {editingCollege ? 'Edit College' : 'Add New College'}
                </h3>
                <button 
                  onClick={() => setShowCollegeModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Simplified College Form */}
              <form onSubmit={handleAddCollege} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">College Name</label>
                  <input
                    type="text"
                    name="name"
                    value={collegeData.name}
                    onChange={handleCollegeChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">College Code</label>
                  <input
                    type="text"
                    name="code"
                    value={collegeData.code}
                    onChange={handleCollegeChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {isLoading ? 'Saving...' : (editingCollege ? 'Update College' : 'Add College')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;