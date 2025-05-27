import express from 'express';
const router = express.Router();
import * as facultyController from '../controllers/facultyController.js';
import adminAuth from '../middleware/adminAuth.js';

// Apply authentication middleware to all routes
router.use(adminAuth);

// Faculty CRUD routes
router.get('/departments/:departmentId/faculties', facultyController.getFacultiesByDepartment);
router.post('/departments/:departmentId/faculties', facultyController.createFaculty);
router.get('/faculties/:id', facultyController.getFacultyById);
router.put('/faculties/:id', facultyController.updateFaculty);
router.delete('/faculties/:id', facultyController.deleteFaculty);
router.patch('/faculties/:id/toggle-status', facultyController.toggleFacultyStatus);

export default router;
