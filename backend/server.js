import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import programRoutes from './routes/programRoutes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Health check
app.get('/', (req, res) => {
  res.send('Backend running and MongoDB connected');
});

// Admin routes
app.use('/api/admin', adminRoutes);

// College routes
app.use('/api/colleges', collegeRoutes);

// Program routes
app.use('/api/programs', programRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
