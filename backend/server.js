import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from './routes/admin.js';
import members from './routes/members.js';
import passcodes from './routes/passcodes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test route
app.post('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Routes
app.use('/admin', admin);
app.use('/api/members', members);
app.use('/api/passcodes', passcodes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
  });
});

// Connect to DB and start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.error('Failed to connect to MongoDB. Check your MONGODB_URI in .env');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Export for Vercel
export default app;