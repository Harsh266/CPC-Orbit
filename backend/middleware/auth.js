import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    // Your authentication logic
    // ...
  } catch (error) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // Your admin check logic
    // ...
  } catch (error) {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};