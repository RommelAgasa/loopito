// index.js (or app.js)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from '../db/db.js';
import admin from '../routes/admin.js';
import members from '../routes/members.js';
import passcodes from '../routes/passcodes.js';

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  'https://loopito-frontend.vercel.app',
  'http://localhost:3000', // for local dev
];

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile/Postman

      const cleanedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Health check routes
app.get('/health', (req, res) => res.json({ status: 'Server is running' }));
app.post('/test', (req, res) => res.json({ message: 'Test route works!' }));

// Database connection test route
app.get('/api/db-test', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ connected: true });
  } catch (err) {
    console.error('DB connection test error:', err.message);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// API routes
app.use('/api/admin', admin);
app.use('/api/members', members);
app.use('/api/passcodes', passcodes);
app.post('/test-verify', (req, res) => res.json({ message: 'Test route works!' }));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Server error' });
});

export default app;
