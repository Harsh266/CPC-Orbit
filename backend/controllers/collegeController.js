import College from '../models/College.js';

// Get all colleges
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json({ success: true, data: colleges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single college by ID
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    res.json({ success: true, data: college });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new college
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
      code: code.trim().toUpperCase()
    });

    const savedCollege = await college.save();
    res.status(201).json({ 
      success: true, 
      data: savedCollege,
      message: 'College created successfully' 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'College with this code already exists' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a college
export const updateCollege = async (req, res) => {
  try {
    const { name, code } = req.body;
    const collegeId = req.params.id;

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    // Check if another college with same code exists (excluding current one)
    if (code && code.trim().toUpperCase() !== college.code) {
      const existingCollege = await College.findOne({ 
        code: code.trim().toUpperCase(),
        _id: { $ne: collegeId }
      });
      if (existingCollege) {
        return res.status(400).json({ 
          success: false, 
          message: 'College with this code already exists' 
        });
      }
    }

    const updatedCollege = await College.findByIdAndUpdate(
      collegeId,
      {
        name: name?.trim() || college.name,
        code: code?.trim().toUpperCase() || college.code,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({ 
      success: true, 
      data: updatedCollege,
      message: 'College updated successfully' 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'College with this code already exists' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a college
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    await College.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: 'College deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
