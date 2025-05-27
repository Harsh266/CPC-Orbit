import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Add a route for root URL to show status in browser
app.get('/', (req, res) => {
  res.send('Backend running and MongoDB connected');
});

// Use your admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/colleges', collegeRoutes);
app.use('/api/admin/colleges', departmentRoutes);
app.use('/api/admin', facultyRoutes);
app.use('/api/admin', studentRoutes);
app.use('/api/admin', subjectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
