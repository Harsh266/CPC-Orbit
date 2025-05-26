import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import * as collegeController from '../controllers/collegeController.js';

const router = express.Router();

// College routes - all protected by admin middleware
router.get('/colleges', collegeController.getAllColleges);
router.get('/colleges/:id', isAuthenticated, isAdmin, collegeController.getCollegeById);
router.post('/colleges', collegeController.createCollege);
router.put('/colleges/:id', isAuthenticated, isAdmin, collegeController.updateCollege);
router.delete('/colleges/:id', isAuthenticated, isAdmin, collegeController.deleteCollege);

export default router;