import express from 'express';
import {
  getProgramsByCollege,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../controllers/programController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Get all programs for a specific college
router.get('/college/:collegeId', getProgramsByCollege);

// Get a single program by ID
router.get('/:id', getProgramById);

// Create a new program for a specific college
router.post('/college/:collegeId', createProgram);

// Update a program
router.put('/:id', updateProgram);

// Delete a program
router.delete('/:id', deleteProgram);

export default router;
