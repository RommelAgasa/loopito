import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from '../routes/admin.js';
import members from '../routes/members.js';
import passcodes from '../routes/passcodes.js';

dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://loopito-frontend.vercel.app',
  'http://localhost:3000', // for local development
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    // Remove trailing slash from incoming origin
    const cleanedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(cleanedOrigin)) {
      callback(null, true); // allow this origin
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    return false;
  }
};

// Connect to DB
await connectDB();

app.get('/health', (req, res) => res.json({ status: 'Server is running' }));
app.post('/test', (req, res) => res.json({ message: 'Test route works!' }));

// All routes should be prefixed with /api to match frontend requests
app.use('/api/admin', admin);
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