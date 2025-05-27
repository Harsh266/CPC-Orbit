import Faculty from '../models/Faculty.js';
import Department from '../models/Department.js';
import College from '../models/College.js';

// Get all faculties for a specific department
export const getFacultiesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const faculties = await Faculty.find({ department: departmentId })
      .populate('department', 'name code')
      .populate('college', 'name code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: faculties,
      total: faculties.length,
      department: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculties',
      error: error.message
    });
  }
};

// Get faculty by ID
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('department', 'name code')
      .populate('college', 'name code');
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty',
      error: error.message
    });
  }
};

// Create new faculty
export const createFaculty = async (req, res) => {
  try {
    const { 
      employeeId, firstName, lastName, email, phone, dateOfBirth, gender,
      address, qualification, experience, specialization, dateOfJoining,
      salary, designation, bloodGroup, emergencyContact
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

    // Check if faculty with same employee ID already exists
    const existingFaculty = await Faculty.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this employee ID already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await Faculty.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this email already exists'
      });
    }

    const faculty = new Faculty({
      employeeId: employeeId.toUpperCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address: address.trim(),
      department: departmentId,
      college: department.college,
      designation,
      qualification: qualification.trim(),
      experience: parseInt(experience),
      specialization: specialization?.trim() || '',
      dateOfJoining: new Date(dateOfJoining),
      salary: parseFloat(salary),
      bloodGroup,
      emergencyContact: emergencyContact.trim()
    });

    const savedFaculty = await faculty.save();
    await savedFaculty.populate(['department', 'college']);

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: savedFaculty
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        message: `Faculty with this ${field} already exists`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating faculty',
        error: error.message
      });
    }
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  try {
    const { 
      employeeId, firstName, lastName, email, phone, designation, 
      qualification, experience, specialization, dateOfJoining, isActive 
    } = req.body;
    const { id } = req.params;

    const existingFaculty = await Faculty.findById(id);
    if (!existingFaculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // Check if another faculty with same employee ID exists
    const duplicateEmployeeId = await Faculty.findOne({ 
      employeeId: employeeId.toUpperCase(),
      _id: { $ne: id }
    });
    if (duplicateEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Another faculty with this employee ID already exists'
      });
    }

    // Check if another faculty with same email exists
    const duplicateEmail = await Faculty.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: id }
    });
    if (duplicateEmail) {
      return res.status(400).json({
        success: false,
        message: 'Another faculty with this email already exists'
      });
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      {
        employeeId: employeeId.toUpperCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        designation,
        qualification: qualification.trim(),
        experience,
        specialization: specialization?.trim() || '',
        dateOfJoining: new Date(dateOfJoining),
        isActive: isActive !== undefined ? isActive : existingFaculty.isActive
      },
      { new: true, runValidators: true }
    ).populate(['department', 'college']);

    res.json({
      success: true,
      message: 'Faculty updated successfully',
      data: updatedFaculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating faculty',
      error: error.message
    });
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    await Faculty.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting faculty',
      error: error.message
    });
  }
};

// Toggle faculty status
export const toggleFacultyStatus = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { isActive: !faculty.isActive },
      { new: true }
    ).populate(['department', 'college']);

    res.json({
      success: true,
      message: `Faculty ${updatedFaculty.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedFaculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating faculty status',
      error: error.message
    });
  }
};
