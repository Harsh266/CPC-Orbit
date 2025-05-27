import Subject from '../models/Subject.js';
import Department from '../models/Department.js';
import Faculty from '../models/Faculty.js';

// Get all subjects for a specific department
export const getSubjectsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const subjects = await Subject.find({ department: departmentId })
      .populate('department', 'name code')
      .populate('college', 'name code')
      .populate('faculty', 'firstName lastName employeeId')
      .populate('prerequisite', 'name code')
      .sort({ year: 1, semester: 1, name: 1 });

    res.json({
      success: true,
      data: subjects,
      total: subjects.length,
      department: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Get subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('department', 'name code')
      .populate('college', 'name code')
      .populate('faculty', 'firstName lastName employeeId')
      .populate('prerequisite', 'name code');
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message
    });
  }
};

// Get faculties for dropdown in department
export const getFacultiesForSubject = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const faculties = await Faculty.find({ 
      department: departmentId, 
      isActive: true 
    }).select('firstName lastName employeeId');

    res.json({
      success: true,
      data: faculties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculties',
      error: error.message
    });
  }
};

// Get subjects for prerequisite dropdown
export const getSubjectsForPrerequisite = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const subjects = await Subject.find({ 
      department: departmentId, 
      isActive: true 
    }).select('name code year semester');

    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Create new subject
export const createSubject = async (req, res) => {
  try {
    const { 
      subjectCode, subjectName, credits, semester, year, subjectType,
      description, prerequisites, assignedFaculty
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

    // Check if subject with same code already exists in this department
    const existingSubject = await Subject.findOne({ 
      subjectCode: subjectCode.toUpperCase(),
      department: departmentId 
    });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this code already exists in this department'
      });
    }

    // Validate faculty if provided
    if (assignedFaculty) {
      const facultyExists = await Faculty.findOne({ 
        _id: assignedFaculty, 
        department: departmentId,
        isActive: true 
      });
      if (!facultyExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected faculty not found or not active in this department'
        });
      }
    }

    const subject = new Subject({
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.toUpperCase().trim(),
      description: description?.trim() || '',
      department: departmentId,
      college: department.college,
      credits: parseInt(credits),
      subjectType,
      semester: parseInt(semester),
      year,
      prerequisites: prerequisites || [],
      assignedFaculty: assignedFaculty || null
    });

    const savedSubject = await subject.save();
    await savedSubject.populate(['department', 'college', 'assignedFaculty', 'prerequisites']);

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: savedSubject
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Subject with this code already exists in this department'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating subject',
        error: error.message
      });
    }
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  try {
    const { 
      name, code, description, credits, type, semester, year, 
      program, isElective, prerequisite, faculty, syllabus, isActive 
    } = req.body;
    const { id } = req.params;

    const existingSubject = await Subject.findById(id);
    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check if another subject with same code exists in the same department
    const duplicateSubject = await Subject.findOne({ 
      code: code.toUpperCase(),
      department: existingSubject.department,
      _id: { $ne: id }
    });
    if (duplicateSubject) {
      return res.status(400).json({
        success: false,
        message: 'Another subject with this code already exists in this department'
      });
    }

    // Validate faculty if provided
    if (faculty) {
      const facultyExists = await Faculty.findOne({ 
        _id: faculty, 
        department: existingSubject.department,
        isActive: true 
      });
      if (!facultyExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected faculty not found or not active in this department'
        });
      }
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        code: code.toUpperCase().trim(),
        description: description?.trim() || '',
        credits,
        type,
        semester,
        year,
        program,
        isElective: isElective || false,
        prerequisite: prerequisite || [],
        faculty: faculty || null,
        syllabus: syllabus?.trim() || '',
        isActive: isActive !== undefined ? isActive : existingSubject.isActive
      },
      { new: true, runValidators: true }
    ).populate(['department', 'college', 'faculty', 'prerequisite']);

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subject',
      error: error.message
    });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check if this subject is a prerequisite for other subjects
    const dependentSubjects = await Subject.find({ prerequisite: req.params.id });
    if (dependentSubjects.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete subject as it is a prerequisite for other subjects'
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
};

// Toggle subject status
export const toggleSubjectStatus = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { isActive: !subject.isActive },
      { new: true }
    ).populate(['department', 'college', 'faculty', 'prerequisite']);

    res.json({
      success: true,
      message: `Subject ${updatedSubject.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedSubject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subject status',
      error: error.message
    });
  }
};
