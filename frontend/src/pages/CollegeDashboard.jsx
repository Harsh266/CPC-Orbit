import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function CollegeDashboard() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeProjects: 0
  });

  // Fetch college details
  useEffect(() => {
    fetchCollegeDetails();
  }, [collegeId]);

  const fetchCollegeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/colleges/${collegeId}`);
      setCollege(response.data);
      // You can also fetch college-specific stats here
      // const statsResponse = await api.get(`/admin/colleges/${collegeId}/stats`);
      // setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to fetch college details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToColleges = () => {
    navigate('/admin-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'College not found'}</p>
            <button
              onClick={goBackToColleges}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Back to Colleges
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={goBackToColleges}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition"
              title="Back to Admin Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{college.name}</h1>
              <p className="text-sm text-gray-600">College Code: {college.code}</p>
            </div>
          </div>
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

        {/* Breadcrumb navigation */}
        <div className="bg-white shadow-md rounded-lg mb-6 p-4">
          <div className="flex items-center text-sm text-gray-500">
            <button
              onClick={goBackToColleges}
              className="hover:text-indigo-600 transition"
            >
              Admin Dashboard
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={goBackToColleges}
              className="hover:text-indigo-600 transition"
            >
              Manage Colleges
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{college.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Students</h3>
                <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Total Faculty</h3>
                <div className="text-3xl font-bold text-green-600">{stats.totalFaculty}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Active Projects</h3>
                <div className="text-3xl font-bold text-purple-600">{stats.activeProjects}</div>
              </div>
            </div>

            {/* College Details Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">College Details</h3>
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">College Name</p>
                    <p className="font-medium">{college.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">College Code</p>
                    <p className="font-medium">{college.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{college.city && college.state ? `${college.city}, ${college.state}` : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium">{college.contactPerson || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Email</p>
                    <p className="font-medium">{college.contactEmail || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="font-medium">{college.contactPhone || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{college.address || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Sections */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Student Management</h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                    View All Students
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                    Add New Student
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                    Import Students
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Faculty Management</h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition">
                    View All Faculty
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition">
                    Add New Faculty
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition">
                    Assign Coordinators
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                  Generate Reports
                </button>
                <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                  View Analytics
                </button>
                <button className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDashboard;
