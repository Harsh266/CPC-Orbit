import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaUniversity, FaGraduationCap, FaCode, FaClock, FaFileAlt } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [colleges, setColleges] = useState([]);
  const navigate = useNavigate();

  // Fetch all programs with college information
  const fetchPrograms = async () => {
    try {
      const response = await api.get('/colleges', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.data.success) {
        const collegesData = response.data.data;
        setColleges(collegesData);
        
        // Fetch programs for each college
        const allPrograms = [];
        for (const college of collegesData) {
          try {
            const programsResponse = await api.get(`/programs/college/${college._id}`, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
              },
            });
            if (programsResponse.data.success) {
              allPrograms.push(...programsResponse.data.data);
            }
          } catch (err) {
            console.error(`Error fetching programs for college ${college.name}:`, err);
          }
        }
        
        setPrograms(allPrograms);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Failed to load programs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Handle view program details
  const handleViewDetails = (program) => {
    navigate(`/admin/programs/${program._id}`);
  };

  // Handle view college details
  const handleViewCollege = (college) => {
    navigate(`/admin/colleges/${college._id}`);
  };

  // Filter programs based on search term and selected college
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.college.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = selectedCollege === '' || program.college._id === selectedCollege;
    
    return matchesSearch && matchesCollege;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 bg-gray-100">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <p className="text-gray-600">Loading programs...</p>
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
                  onClick={fetchPrograms}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
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
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FaGraduationCap />
                    All Programs
                  </h1>
                  <p className="text-purple-100">Overview of all programs across colleges</p>
                </div>
                <div className="text-white">
                  <span className="text-2xl font-bold">{filteredPrograms.length}</span>
                  <p className="text-sm text-purple-200">Total Programs</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Programs
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Search by program name, code, or college..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by College
                  </label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Colleges</option>
                    {colleges.map(college => (
                      <option key={college._id} value={college._id}>
                        {college.name} ({college.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Programs List */}
            <div className="p-6">
              {filteredPrograms.length === 0 ? (
                <div className="text-center py-8">
                  <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">
                    {programs.length === 0 ? 'No programs found' : 'No programs match your search criteria'}
                  </p>
                  {programs.length === 0 && (
                    <button
                      onClick={() => navigate('/admin/colleges')}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Go to Colleges to Add Programs
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredPrograms.map((program) => (
                    <div key={program._id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Program Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-mono">
                              {program.code}
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {program.duration}
                            </span>
                          </div>
                          
                          {/* College Information */}
                          <div className="flex items-center gap-2 mb-3">
                            <FaUniversity className="text-blue-600" />
                            <span className="text-blue-600 font-medium">{program.college.name}</span>
                            <span className="text-gray-500">({program.college.code})</span>
                            <button
                              onClick={() => handleViewCollege(program.college)}
                              className="text-blue-600 hover:text-blue-800 text-sm underline ml-2"
                            >
                              View College
                            </button>
                          </div>
                          
                          {/* Description */}
                          {program.description && (
                            <p className="text-gray-600 text-sm mb-3 flex items-start gap-2">
                              <FaFileAlt className="text-gray-400 mt-1 flex-shrink-0" />
                              <span>{program.description}</span>
                            </p>
                          )}
                          
                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {new Date(program.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(program.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleViewDetails(program)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
                          >
                            <FaEye /> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {filteredPrograms.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-b-lg">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Showing {filteredPrograms.length} of {programs.length} programs
                    {selectedCollege && ` from ${colleges.find(c => c._id === selectedCollege)?.name}`}
                  </span>
                  <span>
                    Across {new Set(filteredPrograms.map(p => p.college._id)).size} colleges
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Programs;
