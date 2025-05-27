import express from 'express';
const router = express.Router();
import * as subjectController from '../controllers/subjectController.js';
import adminAuth from '../middleware/adminAuth.js';

// Apply authentication middleware to all routes
router.use(adminAuth);

// Subject CRUD routes
router.get('/departments/:departmentId/subjects', subjectController.getSubjectsByDepartment);
router.post('/departments/:departmentId/subjects', subjectController.createSubject);
router.get('/subjects/:id', subjectController.getSubjectById);
router.put('/subjects/:id', subjectController.updateSubject);
router.delete('/subjects/:id', subjectController.deleteSubject);
router.patch('/subjects/:id/toggle-status', subjectController.toggleSubjectStatus);

export default router;
