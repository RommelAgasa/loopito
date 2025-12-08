import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { connectToDatabase } from '../db/db.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

/**
 * Admin Login Controller
 */
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    await connectToDatabase(); // Ensure DB connection

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // ⚙️ Verify password (simple comparison for now)
    // For production: use bcrypt.compare(password, admin.password)
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT
    const token = generateToken(admin);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Get Admin Profile (Protected route)
 */
export const getAdminProfile = async (req, res) => {
  try {
    await connectToDatabase(); // Ensure DB connection

    const admin = await Admin.findById(req.admin.id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Admin Logout (Handled on frontend usually)
 */
export const adminLogout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
};
