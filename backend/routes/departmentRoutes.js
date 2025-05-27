import express from 'express';
import {
  getDepartmentsByCollege,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus
} from '../controllers/departmentController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// GET /api/admin/colleges/:collegeId/departments - Get all departments for a college
router.get('/:collegeId/departments', getDepartmentsByCollege);

// GET /api/admin/colleges/:collegeId/departments/:departmentId - Get department by ID
router.get('/:collegeId/departments/:departmentId', getDepartmentById);

// POST /api/admin/colleges/:collegeId/departments - Create new department
router.post('/:collegeId/departments', createDepartment);

// PUT /api/admin/departments/:id - Update department
router.put('/departments/:id', updateDepartment);

// PATCH /api/admin/departments/:id/toggle-status - Toggle department status
router.patch('/departments/:id/toggle-status', toggleDepartmentStatus);

// DELETE /api/admin/departments/:id - Delete department
router.delete('/departments/:id', deleteDepartment);

export default router;
