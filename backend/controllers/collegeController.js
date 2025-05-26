import College from '../models/College.js';

// Get all colleges
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.status(200).json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Server error while fetching colleges' });
  }
};

// Get single college by ID
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.status(200).json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ message: 'Server error while fetching college' });
  }
};

// Create new college
export const createCollege = async (req, res) => {
  try {
    // Check if college with the same code already exists
    const existingCollege = await College.findOne({ code: req.body.code });
    if (existingCollege) {
      return res.status(400).json({ message: 'College with this code already exists' });
    }

    const college = new College(req.body);
    await college.save();
    res.status(201).json(college);
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ message: 'Server error while creating college' });
  }
};

// Update college
export const updateCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    // If changing the code, check for duplicates
    if (req.body.code && req.body.code !== college.code) {
      const existingCollege = await College.findOne({ code: req.body.code });
      if (existingCollege) {
        return res.status(400).json({ message: 'College with this code already exists' });
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      college[key] = req.body[key];
    });
    college.updatedAt = Date.now();

    await college.save();
    res.status(200).json(college);
  } catch (error) {
    console.error('Error updating college:', error);
    res.status(500).json({ message: 'Server error while updating college' });
  }
};

// Delete college
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    await College.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Error deleting college:', error);
    res.status(500).json({ message: 'Server error while deleting college' });
  }
};