import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we need to open edit modal from CollegeDetails
  useEffect(() => {
    if (location.state?.editCollege) {
      const college = location.state.editCollege;
      setEditingCollege(college);
      setFormData({ name: college.name, code: college.code });
      setShowModal(true);
      setError('');
      // Clear the state to prevent re-opening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch all colleges
  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });
      if (response.data.success) {
        setColleges(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
      };

      if (editingCollege) {
        // Update existing college
        const response = await api.put(`/colleges/${editingCollege._id}`, formData, { headers });
        if (response.data.success) {
          await fetchColleges();
          setShowModal(false);
          setEditingCollege(null);
          setFormData({ name: '', code: '' });
        }
      } else {
        // Create new college
        const response = await api.post('/colleges', formData, { headers });
        if (response.data.success) {
          await fetchColleges();
          setShowModal(false);
          setFormData({ name: '', code: '' });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        const response = await api.delete(`/colleges/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
          },
        });
        if (response.data.success) {
          await fetchColleges();
        }
      } catch (err) {
        console.error('Error deleting college:', err);
        alert(err.response?.data?.message || 'Failed to delete college');
      }
    }
  };

  // Handle edit
  const handleEdit = (college) => {
    setEditingCollege(college);
    setFormData({ name: college.name, code: college.code });
    setShowModal(true);
    setError('');
  };

  // Handle view details
  const handleViewDetails = (college) => {
    navigate(`/admin/colleges/${college._id}`);
  };

  // Reset modal
  const resetModal = () => {
    setShowModal(false);
    setEditingCollege(null);
    setFormData({ name: '', code: '' });
    setError('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 bg-gray-100">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Colleges Management</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus /> Add College
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading colleges...</p>
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No colleges found. Add your first college!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
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
                    {colleges.map((college) => (
                      <tr key={college._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {college.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {college.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(college.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(college)}
                              className="text-green-600 hover:text-green-900"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEdit(college)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(college._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal for Add/Edit College */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingCollege ? 'Edit College' : 'Add New College'}
                  </h3>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        College Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter college name"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        College Code
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter college code"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={resetModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {editingCollege ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Colleges;
