import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaCalendar, FaCode, FaGraduationCap, FaUniversity, FaClock, FaFileAlt } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch program details
  const fetchProgramDetails = async () => {
    try {
      const response = await api.get(`/programs/${programId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });
      if (response.data.success) {
        setProgram(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching program details:', err);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else if (err.response?.status === 404) {
        setError('Program not found');
      } else {
        setError('Failed to load program details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramDetails();
  }, [programId]);
  const handleBack = () => {
    if (program?.college?._id) {
      navigate(`/admin/colleges/${program.college._id}`);
    } else {
      navigate('/admin/colleges');
    }
  };

  const handleEdit = () => {
    // Navigate back to college details page with edit mode
    navigate(`/admin/colleges/${program.college._id}`, { 
      state: { editProgram: program } 
    });
  };

  const handleViewCollege = () => {
    navigate(`/admin/colleges/${program.college._id}`);
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
                <p className="text-gray-600">Loading program details...</p>
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
                >                  <FaArrowLeft /> Back to Programs
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
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBack}
                    className="text-white hover:text-purple-200 transition-colors"
                  >
                    <FaArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      <FaGraduationCap />
                      {program.name}
                    </h1>
                    <p className="text-purple-100">Program Details</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleViewCollege}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <FaUniversity /> View College
                  </button>
                  <button
                    onClick={handleEdit}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <FaEdit /> Edit Program
                  </button>
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div className="p-6">
              {/* College Information Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <FaUniversity />
                      {program.college.name}
                    </h3>
                    <p className="text-blue-600">College Code: {program.college.code}</p>
                  </div>
                  <button
                    onClick={handleViewCollege}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View College Details
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-purple-600" />
                      Program Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Program Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900">{program.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <FaCode className="text-gray-400" />
                          Program Code
                        </label>
                        <p className="text-lg font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded inline-block">
                          {program.code}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <FaClock className="text-gray-400" />
                          Duration
                        </label>
                        <p className="text-lg text-gray-900 bg-green-100 text-green-800 px-3 py-1 rounded inline-block">
                          {program.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamps and Description */}
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
                          {new Date(program.createdAt).toLocaleDateString('en-US', {
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
                          {new Date(program.updatedAt).toLocaleDateString('en-US', {
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
                </div>
              </div>

              {/* Description Section */}
              {program.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-orange-600" />
                    Description
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{program.description}</p>
                  </div>
                </div>
              )}

              {/* Additional Information Section */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Information
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> This program is offered by {program.college.name} ({program.college.code}). 
                    You can manage subjects, students, and other program-related activities from the respective sections.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleEdit}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit Program
                </button>
                <button
                  onClick={handleViewCollege}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaUniversity /> View College
                </button>                <button
                  onClick={handleBack}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaArrowLeft /> Back to College
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProgramDetail;
