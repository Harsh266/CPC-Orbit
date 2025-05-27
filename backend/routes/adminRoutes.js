import express from 'express';
import { signup, login, getDashboard } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/dashboard', adminAuth, getDashboard);

export default router;
