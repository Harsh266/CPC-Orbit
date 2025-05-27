import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, name: admin.name, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

  const admin = await Admin.create({ name, email, password });

  if (admin) {
    res.json({ token: generateToken(admin) });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({ token: generateToken(admin) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getDashboard = (req, res) => {
  res.json({
    message: `Welcome, ${req.admin.name}`,
    admin: {
      name: req.admin.name,
      email: req.admin.email,
    },
  });
};
