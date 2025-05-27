import Department from '../models/Department.js';
import College from '../models/College.js';

// Get all departments for a specific college
export const getDepartmentsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    const departments = await Department.find({ college: collegeId })
      .populate('college', 'name code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: departments,
      total: departments.length,
      college: college
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const department = await Department.findById(departmentId)
      .populate('college', 'name code');
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message
    });
  }
};

// Create new department
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const { collegeId } = req.params;

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if department with same code already exists in this college
    const existingDepartment = await Department.findOne({ 
      code: code.toUpperCase(),
      college: collegeId 
    });
    
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Department with this code already exists in this college'
      });
    }

    const department = new Department({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      description: description?.trim() || '',
      college: collegeId
    });

    const savedDepartment = await department.save();
    await savedDepartment.populate('college', 'name code');

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: savedDepartment
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Department with this code already exists in this college'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating department',
        error: error.message
      });
    }
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;
    const { id } = req.params;

    // Check if department exists
    const existingDepartment = await Department.findById(id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if another department with same code exists in the same college (excluding current department)
    const duplicateDepartment = await Department.findOne({ 
      code: code.toUpperCase(),
      college: existingDepartment.college,
      _id: { $ne: id }
    });
    
    if (duplicateDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Another department with this code already exists in this college'
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        code: code.toUpperCase().trim(),
        description: description?.trim() || '',
        isActive: isActive !== undefined ? isActive : existingDepartment.isActive
      },
      { new: true, runValidators: true }
    ).populate('college', 'name code');

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating department',
      error: error.message
    });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message
    });
  }
};

// Toggle department status (active/inactive)
export const toggleDepartmentStatus = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: !department.isActive },
      { new: true }
    ).populate('college', 'name code');

    res.json({
      success: true,
      message: `Department ${updatedDepartment.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedDepartment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating department status',
      error: error.message
    });
  }
};
