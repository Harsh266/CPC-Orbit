import College from '../models/College.js';

// Get all colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: colleges,
      total: colleges.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching colleges',
      error: error.message
    });
  }
};

// Get college by ID
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      data: college
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching college',
      error: error.message
    });
  }
};

// Create new college
export const createCollege = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if college with same code already exists
    const existingCollege = await College.findOne({ code: code.toUpperCase() });
    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message: 'College with this code already exists'
      });
    }

    const college = new College({
      name: name.trim(),
      code: code.toUpperCase().trim()
    });

    const savedCollege = await college.save();

    res.status(201).json({
      success: true,
      message: 'College created successfully',
      data: savedCollege
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'College with this code already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating college',
        error: error.message
      });
    }
  }
};

// Update college
export const updateCollege = async (req, res) => {
  try {
    const { name, code } = req.body;
    const collegeId = req.params.id;

    // Check if college exists
    const existingCollege = await College.findById(collegeId);
    if (!existingCollege) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if another college with same code exists (excluding current college)
    const duplicateCollege = await College.findOne({ 
      code: code.toUpperCase(),
      _id: { $ne: collegeId }
    });
    
    if (duplicateCollege) {
      return res.status(400).json({
        success: false,
        message: 'Another college with this code already exists'
      });
    }

    const updatedCollege = await College.findByIdAndUpdate(
      collegeId,
      {
        name: name.trim(),
        code: code.toUpperCase().trim()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'College updated successfully',
      data: updatedCollege
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating college',
      error: error.message
    });
  }
};

// Delete college
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    await College.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'College deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting college',
      error: error.message
    });
  }
};
