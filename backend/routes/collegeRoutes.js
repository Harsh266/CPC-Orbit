import express from 'express';
import {
  getAllColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege
} from '../controllers/collegeController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Get all colleges
router.get('/', getAllColleges);

// Get a single college by ID
router.get('/:id', getCollegeById);

// Create a new college
router.post('/', createCollege);

// Update a college
router.put('/:id', updateCollege);

// Delete a college
router.delete('/:id', deleteCollege);

export default router;
