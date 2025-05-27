import express from 'express';
import {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege
} from '../controllers/collegeController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// GET /api/admin/colleges - Get all colleges
router.get('/', getColleges);

// GET /api/admin/colleges/:id - Get college by ID
router.get('/:id', getCollegeById);

// POST /api/admin/colleges - Create new college
router.post('/', createCollege);

// PUT /api/admin/colleges/:id - Update college
router.put('/:id', updateCollege);

// DELETE /api/admin/colleges/:id - Delete college
router.delete('/:id', deleteCollege);

export default router;
