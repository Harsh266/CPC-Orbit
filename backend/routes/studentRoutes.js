import express from 'express';
const router = express.Router();
import * as studentController from '../controllers/studentController.js';
import adminAuth from '../middleware/adminAuth.js';

// Apply authentication middleware to all routes
router.use(adminAuth);

// Student CRUD routes
router.get('/departments/:departmentId/students', studentController.getStudentsByDepartment);
router.post('/departments/:departmentId/students', studentController.createStudent);
router.get('/students/:id', studentController.getStudentById);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.patch('/students/:id/toggle-status', studentController.toggleStudentStatus);

export default router;
