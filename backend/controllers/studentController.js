import Student from '../models/Student.js';
import Department from '../models/Department.js';

// Get all students for a specific department
export const getStudentsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const students = await Student.find({ department: departmentId })
      .populate('department', 'name code')
      .populate('college', 'name code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students,
      total: students.length,
      department: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('department', 'name code')
      .populate('college', 'name code');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  try {
    const { 
      studentId, firstName, lastName, email, phone, dateOfBirth, gender,
      rollNumber, admissionDate, address, semester, year, bloodGroup,
      parentName, parentPhone, parentEmail, parentOccupation
    } = req.body;
    const { departmentId } = req.params;

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if student with same student ID already exists
    const existingStudent = await Student.findOne({ studentId: studentId.toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this student ID already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Check if roll number already exists in this department
    const existingRollNumber = await Student.findOne({ 
      rollNumber: rollNumber.toUpperCase(), 
      department: departmentId 
    });
    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists in this department'
      });
    }

    const student = new Student({
      studentId: studentId.toUpperCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      dateOfBirth: new Date(dateOfBirth),
      gender,
      department: departmentId,
      college: department.college,
      rollNumber: rollNumber.toUpperCase().trim(),
      admissionDate: new Date(admissionDate),
      address: address.trim(),
      semester: parseInt(semester),
      year,
      bloodGroup,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail ? parentEmail.toLowerCase().trim() : '',
      parentOccupation: parentOccupation || ''
    });

    const savedStudent = await student.save();
    await savedStudent.populate(['department', 'college']);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: savedStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        message: `Student with this ${field} already exists`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating student',
        error: error.message
      });
    }
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { 
      studentId, firstName, lastName, email, phone, program, 
      year, semester, rollNumber, dateOfAdmission, address, parentContact, isActive 
    } = req.body;
    const { id } = req.params;

    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check duplicates
    const duplicateStudentId = await Student.findOne({ 
      studentId: studentId.toUpperCase(),
      _id: { $ne: id }
    });
    if (duplicateStudentId) {
      return res.status(400).json({
        success: false,
        message: 'Another student with this student ID already exists'
      });
    }

    const duplicateEmail = await Student.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: id }
    });
    if (duplicateEmail) {
      return res.status(400).json({
        success: false,
        message: 'Another student with this email already exists'
      });
    }

    const duplicateRollNumber = await Student.findOne({ 
      rollNumber: rollNumber.toUpperCase(),
      department: existingStudent.department,
      _id: { $ne: id }
    });
    if (duplicateRollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Another student with this roll number already exists in this department'
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        studentId: studentId.toUpperCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        program,
        year,
        semester,
        rollNumber: rollNumber.toUpperCase().trim(),
        dateOfAdmission: new Date(dateOfAdmission),
        address: address || {},
        parentContact: parentContact || {},
        isActive: isActive !== undefined ? isActive : existingStudent.isActive
      },
      { new: true, runValidators: true }
    ).populate(['department', 'college']);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Toggle student status
export const toggleStudentStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: !student.isActive },
      { new: true }
    ).populate(['department', 'college']);

    res.json({
      success: true,
      message: `Student ${updatedStudent.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student status',
      error: error.message
    });
  }
};
