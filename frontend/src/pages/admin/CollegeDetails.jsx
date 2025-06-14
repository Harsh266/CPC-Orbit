import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaCalendar, FaCode, FaUniversity, FaGraduationCap, FaPlus, FaEye, FaTrash, FaClock, FaFileAlt } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [college, setCollege] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '', 
    duration: '', 
    description: '' 
  });
  const [formError, setFormError] = useState('');

  // Check if we need to open edit modal from ProgramDetail
  useEffect(() => {
    if (location.state?.editProgram) {
      const program = location.state.editProgram;
      setEditingProgram(program);
      setFormData({ 
        name: program.name, 
        code: program.code, 
        duration: program.duration,
        description: program.description || ''
      });
      setShowModal(true);
      setFormError('');
      // Clear the state to prevent re-opening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  // Fetch college details
  const fetchCollegeDetails = async () => {
    try {
      const response = await api.get(`/colleges/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });
      if (response.data.success) {
        setCollege(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching college details:', err);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else if (err.response?.status === 404) {
        setError('College not found');
      } else {
        setError('Failed to load college details');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch programs for the college
  const fetchPrograms = async () => {
    try {
      const response = await api.get(`/programs/college/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });
      if (response.data.success) {
        setPrograms(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setProgramsLoading(false);
    }
  };
  useEffect(() => {
    fetchCollegeDetails();
    fetchPrograms();
  }, [id]);
  const handleBack = () => {
    navigate('/admin/colleges');
  };
  
  const handleEdit = () => {
    // Navigate back to colleges page with edit mode
    navigate('/admin/colleges', { state: { editCollege: college } });
  };

  const handleManagePrograms = () => {
    navigate(`/admin/colleges/${college._id}/programs`);
  };

  // Program management functions
  const handleViewProgramDetails = (program) => {
    navigate(`/admin/programs/${program._id}`);
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setFormData({ name: '', code: '', duration: '', description: '' });
    setShowModal(true);
    setFormError('');
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setFormData({ 
      name: program.name, 
      code: program.code, 
      duration: program.duration,
      description: program.description || ''
    });
    setShowModal(true);
    setFormError('');
  };

  const handleDeleteProgram = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        const response = await api.delete(`/programs/${programId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
          },
        });
        if (response.data.success) {
          await fetchPrograms();
        }
      } catch (err) {
        console.error('Error deleting program:', err);
        alert(err.response?.data?.message || 'Failed to delete program');
      }
    }
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
      };

      if (editingProgram) {
        // Update existing program
        const response = await api.put(`/programs/${editingProgram._id}`, formData, { headers });
        if (response.data.success) {
          await fetchPrograms();
          setShowModal(false);
          setEditingProgram(null);
          setFormData({ name: '', code: '', duration: '', description: '' });
        }
      } else {
        // Create new program
        const response = await api.post(`/programs/college/${id}`, formData, { headers });
        if (response.data.success) {
          await fetchPrograms();
          setShowModal(false);
          setFormData({ name: '', code: '', duration: '', description: '' });
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred');
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({ name: '', code: '', duration: '', description: '' });
    setFormError('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 bg-gray-100">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <p className="text-gray-600">Loading college details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 bg-gray-100">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleBack}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <FaArrowLeft /> Back to Colleges
                </button>
              </div>
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
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBack}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <FaArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold">{college.name}</h1>
                    <p className="text-blue-100">College Details</p>
                  </div>
                </div>                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <FaEdit /> Edit College
                  </button>
                  <button
                    onClick={handleAddProgram}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                  >
                    <FaPlus /> Add Program
                  </button>
                </div>
              </div>
            </div>

            {/* College Information */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUniversity className="text-blue-600" />
                      Basic Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          College Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900">{college.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <FaCode className="text-gray-400" />
                          College Code
                        </label>
                        <p className="text-lg font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded inline-block">
                          {college.code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaCalendar className="text-green-600" />
                      Timestamps
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Created Date
                        </label>
                        <p className="text-gray-900">
                          {new Date(college.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Last Updated
                        </label>
                        <p className="text-gray-900">
                          {new Date(college.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>              </div>

              {/* Programs Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaGraduationCap className="text-purple-600" />
                    Programs ({programs.length})
                  </h2>
                  <button
                    onClick={handleAddProgram}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <FaPlus /> Add Program
                  </button>
                </div>

                {programsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading programs...</p>
                  </div>
                ) : programs.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaGraduationCap className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-4">No programs found for this college</p>
                    <button
                      onClick={handleAddProgram}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
                    >
                      <FaPlus /> Add First Program
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {programs.map((program) => (
                      <div key={program._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono">
                                {program.code}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                                <FaClock className="text-xs" />
                                {program.duration}
                              </span>
                            </div>
                            {program.description && (
                              <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                                <FaFileAlt className="text-xs" />
                                {program.description.length > 100 
                                  ? `${program.description.substring(0, 100)}...` 
                                  : program.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Created: {new Date(program.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleViewProgramDetails(program)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEditProgram(program)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(program._id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information Section */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Information
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> This college information can be used for program management, 
                    student enrollment, and administrative purposes throughout the system.
                  </p>
                </div>
              </div>              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit College
                </button>
                <button
                  onClick={handleAddProgram}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FaPlus /> Add Program
                </button>
                <button
                  onClick={handleBack}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaArrowLeft /> Back to List
                </button>
              </div>
            </div>
          </div>

          {/* Modal for Add/Edit Program */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingProgram ? 'Edit Program' : 'Add New Program'}
                  </h3>
                  {formError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleProgramSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Program Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter program name"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Program Code
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter program code"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 4 years, 2 years"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter program description"
                        rows="3"
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
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        {editingProgram ? 'Update' : 'Create'}
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

export default CollegeDetails;
