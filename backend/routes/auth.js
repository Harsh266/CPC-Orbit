// filepath: d:\College Work\CPC-Orbit\backend\routes\auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import multer from 'multer';
import xlsx from 'xlsx';

const router = express.Router();

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Register route with improved error handling
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log('Registration attempt:', { name, email, role });

        // Validate role
        if (!['student', 'faculty', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Check if user exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Duplicate key error",
                field: "email"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (explicitly define fields to avoid any unexpected fields)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error('Registration error details:', error);

        // Return more specific error info
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors
            });
        } else if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message: "Duplicate key error",
                field
            });
        }

        res.status(500).json({
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin register route - for manual registration by admin
router.post('/admin-register', async (req, res) => {
    try {
        const { name, email, password, role, phone, college, program, branch, semester, isCoordinator } = req.body;

        // Validate role
        if (!['student', 'faculty'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Check if user exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Duplicate key error",
                field: "email"
            });
        }

        // Generate an ID based on role
        const prefix = role === 'student' ? 'STU' : 'FAC';
        const randomId = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
        const userId = `${prefix}${randomId}`;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with additional fields based on role
        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
            userId
        };

        // Add role-specific fields
        if (role === 'student') {
            userData.studentDetails = {
                phone,
                college,
                program,
                branch,
                semester
            };
        } else if (role === 'faculty') {
            userData.facultyDetails = {
                phone,
                isCoordinator: isCoordinator || false
            };
        }

        const user = new User(userData);
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error('Admin registration error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors
            });
        } else if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message: "Duplicate key error",
                field
            });
        }

        res.status(500).json({ message: "Server error" });
    }
});

// Bulk registration route - for Excel imports
router.post('/bulk-register', upload.single('file'), async (req, res) => {
    try {
        const userType = req.body.userType; // 'student' or 'faculty'
        if (!['student', 'faculty'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid userType' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Parse Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        let successCount = 0;
        let errors = [];
        for (const row of rows) {
            try {
                let userData = {};
                let password = '123456';
                let prefix = userType === 'student' ? 'STU' : 'FAC';
                let randomId = Math.floor(10000 + Math.random() * 90000);
                let userId = `${prefix}${randomId}`;
                if (userType === 'student') {
                    // Required: name, email, phone, college, program, branch, semester
                    userData = {
                        name: row.name || row.Name,
                        email: row.email || row.Email,
                        password: await bcrypt.hash(password, 10),
                        role: 'student',
                        userId,
                        studentDetails: {
                            phone: row.phone || row.Phone,
                            college: row.college || row.College,
                            program: row.program || row.Program,
                            branch: row.branch || row.Branch,
                            semester: row.semester || row.Semester
                        }
                    };
                } else {
                    // Required: name, email, phone, isCoordinator
                    userData = {
                        name: row.name || row.Name,
                        email: row.email || row.Email,
                        password: await bcrypt.hash(password, 10),
                        role: 'faculty',
                        userId,
                        facultyDetails: {
                            phone: row.phone || row.Phone,
                            isCoordinator: row.isCoordinator === true || row.isCoordinator === 'TRUE' || row.isCoordinator === 'Yes' || row['Is Coordinator'] === true || row['Is Coordinator'] === 'TRUE' || row['Is Coordinator'] === 'Yes'
                        }
                    };
                }
                // Check for required fields
                if (!userData.name || !userData.email) {
                    errors.push({ email: userData.email, error: 'Missing required fields' });
                    continue;
                }
                // Check for duplicate email
                const exists = await User.findOne({ email: userData.email });
                if (exists) {
                    errors.push({ email: userData.email, error: 'Duplicate email' });
                    continue;
                }
                const user = new User(userData);
                await user.save();
                successCount++;
            } catch (err) {
                errors.push({ email: row.email || row.Email, error: err.message });
            }
        }
        res.status(201).json({ message: `Users imported successfully`, count: successCount, errors });
    } catch (error) {
        console.error('Bulk registration error:', error);
        res.status(500).json({ message: 'Failed to import users' });
    }
});

// Get all users (for admin dashboard)
router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

export default router;
