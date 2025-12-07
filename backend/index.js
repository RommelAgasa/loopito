import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from '../routes/admin.js';
import member from '../routes/members.js';
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
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
  }
};

connectDB();

app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.use('/admin', admin);
app.use('/api/members', member);
app.use('/api/passcodes', passcodes);

export default app;