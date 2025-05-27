import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const DepartmentDetails = () => {
  const { collegeId, departmentId } = useParams();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(null);
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState('faculties');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for different entities
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Modal states
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  
  // Form states
  const [facultyForm, setFacultyForm] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    qualification: '',
    experience: '',
    specialization: '',
    dateOfJoining: '',
    salary: '',
    designation: 'Lecturer',
    bloodGroup: 'A+',
    emergencyContact: ''
  });
  
  const [studentForm, setStudentForm] = useState({
    studentId: '',
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    admissionDate: '',
    semester: 1,
    year: 'First',
    bloodGroup: 'A+',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: ''
  });
  
  const [subjectForm, setSubjectForm] = useState({
    subjectCode: '',
    subjectName: '',
    credits: 3,
    semester: 1,
    year: 'First',
    subjectType: 'Core',
    description: '',
    prerequisites: [],
    assignedFaculty: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartmentDetails();
    fetchCollegeDetails();
  }, [departmentId, collegeId]);

  useEffect(() => {
    if (activeTab === 'faculties') {
      fetchFaculties();
    } else if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'subjects') {
      fetchSubjects();
    }
  }, [activeTab, departmentId]);

  const fetchDepartmentDetails = async () => {
    try {
      const response = await authAPI.get(`/admin/colleges/${collegeId}/departments/${departmentId}`);
      setDepartment(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch department details');
      setLoading(false);
    }
  };

  const fetchCollegeDetails = async () => {
    try {
      const response = await authAPI.get(`/admin/colleges/${collegeId}`);
      setCollege(response.data);
    } catch (err) {
      console.error('Failed to fetch college details');
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await authAPI.get(`/admin/departments/${departmentId}/faculties`);
      setFaculties(response.data);
    } catch (err) {
      setError('Failed to fetch faculties');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await authAPI.get(`/admin/departments/${departmentId}/students`);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await authAPI.get(`/admin/departments/${departmentId}/subjects`);
      setSubjects(response.data);
    } catch (err) {
      setError('Failed to fetch subjects');
    }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await authAPI.put(`/admin/faculties/${editingItem._id}`, facultyForm);
      } else {
        await authAPI.post(`/admin/departments/${departmentId}/faculties`, facultyForm);
      }
      setShowFacultyModal(false);
      resetFacultyForm();
      fetchFaculties();
    } catch (err) {
      setError('Failed to save faculty');
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await authAPI.put(`/admin/students/${editingItem._id}`, studentForm);
      } else {
        await authAPI.post(`/admin/departments/${departmentId}/students`, studentForm);
      }
      setShowStudentModal(false);
      resetStudentForm();
      fetchStudents();
    } catch (err) {
      setError('Failed to save student');
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await authAPI.put(`/admin/subjects/${editingItem._id}`, subjectForm);
      } else {
        await authAPI.post(`/admin/departments/${departmentId}/subjects`, subjectForm);
      }
      setShowSubjectModal(false);
      resetSubjectForm();
      fetchSubjects();
    } catch (err) {
      setError('Failed to save subject');
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await authAPI.delete(`/admin/${type}s/${id}`);
        if (type === 'faculty') fetchFaculties();
        else if (type === 'student') fetchStudents();
        else if (type === 'subject') fetchSubjects();
      } catch (err) {
        setError(`Failed to delete ${type}`);
      }
    }
  };

  const handleToggleStatus = async (type, id) => {
    try {
      await authAPI.patch(`/admin/${type}s/${id}/toggle-status`);
      if (type === 'faculty') fetchFaculties();
      else if (type === 'student') fetchStudents();
      else if (type === 'subject') fetchSubjects();
    } catch (err) {
      setError(`Failed to toggle ${type} status`);
    }
  };

  const resetFacultyForm = () => {
    setFacultyForm({
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      qualification: '',
      experience: '',
      specialization: '',
      dateOfJoining: '',
      salary: '',
      designation: 'Lecturer',
      bloodGroup: 'A+',
      emergencyContact: ''
    });
    setEditingItem(null);
  };

  const resetStudentForm = () => {
    setStudentForm({
      studentId: '',
      rollNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      admissionDate: '',
      semester: 1,
      year: 'First',
      bloodGroup: 'A+',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      parentOccupation: ''
    });
    setEditingItem(null);
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      subjectCode: '',
      subjectName: '',
      credits: 3,
      semester: 1,
      year: 'First',
      subjectType: 'Core',
      description: '',
      prerequisites: [],
      assignedFaculty: ''
    });
    setEditingItem(null);
  };

  const openEditModal = (type, item) => {
    setEditingItem(item);
    if (type === 'faculty') {
      setFacultyForm(item);
      setShowFacultyModal(true);
    } else if (type === 'student') {
      setStudentForm(item);
      setShowStudentModal(true);
    } else if (type === 'subject') {
      setSubjectForm(item);
      setShowSubjectModal(true);
    }
  };  const filterData = (data, type) => {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];
    
    if (!searchTerm) return safeData;
    
    return safeData.filter(item => {
      if (type === 'faculty') {
        return item.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.email?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (type === 'student') {
        return item.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (type === 'subject') {
        return item.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/admin/colleges/${collegeId}`)}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
            >
              ← Back to {college?.name}
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{department?.name}</h1>
            <p className="text-gray-600 mt-1">{department?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Head: {department?.headOfDepartment || 'Not assigned'}
            </div>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
              department?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {department?.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Faculties</h3>
          <p className="text-3xl font-bold text-blue-600">{Array.isArray(faculties) ? faculties.length : 0}</p>
          <p className="text-sm text-blue-600">
            {Array.isArray(faculties) ? faculties.filter(f => f.isActive).length : 0} Active
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">{Array.isArray(students) ? students.length : 0}</p>
          <p className="text-sm text-green-600">
            {Array.isArray(students) ? students.filter(s => s.isActive).length : 0} Active
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total Subjects</h3>
          <p className="text-3xl font-bold text-purple-600">{Array.isArray(subjects) ? subjects.length : 0}</p>
          <p className="text-sm text-purple-600">
            {Array.isArray(subjects) ? subjects.filter(s => s.isActive).length : 0} Active
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['faculties', 'students', 'subjects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            if (activeTab === 'faculties') {
              resetFacultyForm();
              setShowFacultyModal(true);
            } else if (activeTab === 'students') {
              resetStudentForm();
              setShowStudentModal(true);
            } else if (activeTab === 'subjects') {
              resetSubjectForm();
              setShowSubjectModal(true);
            }
          }}
          className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'faculties' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faculty Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterData(faculties, 'faculty').map((faculty) => (
                <tr key={faculty._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {faculty.firstName} {faculty.lastName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {faculty.employeeId}</div>
                      <div className="text-sm text-gray-500">{faculty.specialization}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{faculty.email}</div>
                    <div className="text-sm text-gray-500">{faculty.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{faculty.designation}</div>
                    <div className="text-sm text-gray-500">{faculty.experience} years exp.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      faculty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {faculty.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openEditModal('faculty', faculty)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus('faculty', faculty._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {faculty.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete('faculty', faculty._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterData(students, 'student').map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                      <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.year} Year</div>
                    <div className="text-sm text-gray-500">Semester {student.semester}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openEditModal('student', student)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus('student', student._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {student.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete('student', student._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faculty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterData(subjects, 'subject').map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subject.subjectName}</div>
                      <div className="text-sm text-gray-500">Code: {subject.subjectCode}</div>
                      <div className="text-sm text-gray-500">Credits: {subject.credits}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subject.year} Year</div>
                    <div className="text-sm text-gray-500">Semester {subject.semester}</div>
                    <div className="text-sm text-gray-500">{subject.subjectType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.assignedFaculty ? 
                        `${subject.assignedFaculty.firstName} ${subject.assignedFaculty.lastName}` : 
                        'Not assigned'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      subject.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openEditModal('subject', subject)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus('subject', subject._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {subject.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete('subject', subject._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Faculty Modal */}
      {showFacultyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Faculty' : 'Add New Faculty'}
              </h3>
              <form onSubmit={handleFacultySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                      type="text"
                      value={facultyForm.employeeId}
                      onChange={(e) => setFacultyForm({...facultyForm, employeeId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={facultyForm.firstName}
                      onChange={(e) => setFacultyForm({...facultyForm, firstName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={facultyForm.lastName}
                      onChange={(e) => setFacultyForm({...facultyForm, lastName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={facultyForm.phone}
                      onChange={(e) => setFacultyForm({...facultyForm, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={facultyForm.dateOfBirth}
                      onChange={(e) => setFacultyForm({...facultyForm, dateOfBirth: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={facultyForm.gender}
                      onChange={(e) => setFacultyForm({...facultyForm, gender: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <select
                      value={facultyForm.designation}
                      onChange={(e) => setFacultyForm({...facultyForm, designation: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Lecturer">Lecturer</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Head of Department">Head of Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualification</label>
                    <input
                      type="text"
                      value={facultyForm.qualification}
                      onChange={(e) => setFacultyForm({...facultyForm, qualification: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                    <input
                      type="number"
                      value={facultyForm.experience}
                      onChange={(e) => setFacultyForm({...facultyForm, experience: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <input
                      type="text"
                      value={facultyForm.specialization}
                      onChange={(e) => setFacultyForm({...facultyForm, specialization: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                    <input
                      type="date"
                      value={facultyForm.dateOfJoining}
                      onChange={(e) => setFacultyForm({...facultyForm, dateOfJoining: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                      type="number"
                      value={facultyForm.salary}
                      onChange={(e) => setFacultyForm({...facultyForm, salary: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <select
                      value={facultyForm.bloodGroup}
                      onChange={(e) => setFacultyForm({...facultyForm, bloodGroup: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <input
                      type="tel"
                      value={facultyForm.emergencyContact}
                      onChange={(e) => setFacultyForm({...facultyForm, emergencyContact: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={facultyForm.address}
                    onChange={(e) => setFacultyForm({...facultyForm, address: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacultyModal(false);
                      resetFacultyForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Add'} Faculty
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Student' : 'Add New Student'}
              </h3>
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <input
                      type="text"
                      value={studentForm.studentId}
                      onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                    <input
                      type="text"
                      value={studentForm.rollNumber}
                      onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={studentForm.firstName}
                      onChange={(e) => setStudentForm({...studentForm, firstName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={studentForm.lastName}
                      onChange={(e) => setStudentForm({...studentForm, lastName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={studentForm.dateOfBirth}
                      onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={studentForm.gender}
                      onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Date</label>
                    <input
                      type="date"
                      value={studentForm.admissionDate}
                      onChange={(e) => setStudentForm({...studentForm, admissionDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <select
                      value={studentForm.semester}
                      onChange={(e) => setStudentForm({...studentForm, semester: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <select
                      value={studentForm.year}
                      onChange={(e) => setStudentForm({...studentForm, year: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="First">First</option>
                      <option value="Second">Second</option>
                      <option value="Third">Third</option>
                      <option value="Fourth">Fourth</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <select
                      value={studentForm.bloodGroup}
                      onChange={(e) => setStudentForm({...studentForm, bloodGroup: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                    <input
                      type="text"
                      value={studentForm.parentName}
                      onChange={(e) => setStudentForm({...studentForm, parentName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                    <input
                      type="tel"
                      value={studentForm.parentPhone}
                      onChange={(e) => setStudentForm({...studentForm, parentPhone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <input
                      type="email"
                      value={studentForm.parentEmail}
                      onChange={(e) => setStudentForm({...studentForm, parentEmail: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Occupation</label>
                    <input
                      type="text"
                      value={studentForm.parentOccupation}
                      onChange={(e) => setStudentForm({...studentForm, parentOccupation: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={studentForm.address}
                    onChange={(e) => setStudentForm({...studentForm, address: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStudentModal(false);
                      resetStudentForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Add'} Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <form onSubmit={handleSubjectSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject Code</label>
                    <input
                      type="text"
                      value={subjectForm.subjectCode}
                      onChange={(e) => setSubjectForm({...subjectForm, subjectCode: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                    <input
                      type="text"
                      value={subjectForm.subjectName}
                      onChange={(e) => setSubjectForm({...subjectForm, subjectName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={subjectForm.credits}
                      onChange={(e) => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <select
                      value={subjectForm.semester}
                      onChange={(e) => setSubjectForm({...subjectForm, semester: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <select
                      value={subjectForm.year}
                      onChange={(e) => setSubjectForm({...subjectForm, year: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="First">First</option>
                      <option value="Second">Second</option>
                      <option value="Third">Third</option>
                      <option value="Fourth">Fourth</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject Type</label>
                    <select
                      value={subjectForm.subjectType}
                      onChange={(e) => setSubjectForm({...subjectForm, subjectType: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Core">Core</option>
                      <option value="Elective">Elective</option>
                      <option value="Practical">Practical</option>
                      <option value="Project">Project</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned Faculty</label>                    <select
                      value={subjectForm.assignedFaculty}
                      onChange={(e) => setSubjectForm({...subjectForm, assignedFaculty: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select Faculty</option>
                      {faculties && faculties.filter(f => f.isActive).map(faculty => (
                        <option key={faculty._id} value={faculty._id}>
                          {faculty.firstName} {faculty.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubjectModal(false);
                      resetSubjectForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Add'} Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetails;
