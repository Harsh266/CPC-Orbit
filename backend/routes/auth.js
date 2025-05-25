// filepath: d:\College Work\CPC-Orbit\backend\routes\auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

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
      // Get the duplicate key field name correctly
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

export default router;
