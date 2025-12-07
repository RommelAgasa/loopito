import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from '../routes/admin.js';
import members from '../routes/members.js';
import passcodes from '../routes/passcodes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

// Connect to DB
connectDB();

app.get('/health', (req, res) => res.json({ status: 'Server is running' }));
app.post('/test', (req, res) => res.json({ message: 'Test route works!' }));

app.use('/admin', admin);
app.use('/api/members', members);
app.use('/api/passcodes', passcodes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Server error' });
});

export default app;