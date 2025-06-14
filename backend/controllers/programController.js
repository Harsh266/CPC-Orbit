import Program from '../models/Program.js';
import College from '../models/College.js';

// Get all programs for a specific college
export const getProgramsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    // Verify college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const programs = await Program.find({ college: collegeId })
      .populate('college', 'name code')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: programs, college });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single program by ID
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('college', 'name code');
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new program
export const createProgram = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { name, code, duration, description } = req.body;

    // Verify college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    // Check if program with same code already exists in this college
    const existingProgram = await Program.findOne({ 
      code: code.toUpperCase(), 
      college: collegeId 
    });
    if (existingProgram) {
      return res.status(400).json({ 
        success: false, 
        message: 'Program with this code already exists in this college' 
      });
    }

    const program = new Program({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      college: collegeId,
      duration: duration.trim(),
      description: description?.trim() || ''
    });

    const savedProgram = await program.save();
    const populatedProgram = await Program.findById(savedProgram._id).populate('college', 'name code');
    
    res.status(201).json({ 
      success: true, 
      data: populatedProgram,
      message: 'Program created successfully' 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Program with this code already exists in this college' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a program
export const updateProgram = async (req, res) => {
  try {
    const { name, code, duration, description } = req.body;
    const programId = req.params.id;

    // Check if program exists
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if another program with same code exists in the same college (excluding current one)
    if (code && code.trim().toUpperCase() !== program.code) {
      const existingProgram = await Program.findOne({ 
        code: code.trim().toUpperCase(),
        college: program.college,
        _id: { $ne: programId }
      });
      if (existingProgram) {
        return res.status(400).json({ 
          success: false, 
          message: 'Program with this code already exists in this college' 
        });
      }
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      {
        name: name?.trim() || program.name,
        code: code?.trim().toUpperCase() || program.code,
        duration: duration?.trim() || program.duration,
        description: description?.trim() || program.description,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('college', 'name code');

    res.json({ 
      success: true, 
      data: updatedProgram,
      message: 'Program updated successfully' 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Program with this code already exists in this college' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a program
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    await Program.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: 'Program deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
