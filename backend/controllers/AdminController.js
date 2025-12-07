import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, username: admin.username },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '24h' }
  );
};

// Admin Login Controller
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    console.log(admin);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password (compare with hashed password)
    // If using bcrypt: const isPasswordValid = await bcrypt.compare(password, admin.password);
    // For now, simple comparison:
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(admin);

    console.log(token);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { 
        id: admin._id, 
        username: admin.username 
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

// Get Admin Profile (protected route)
export const getAdminProfile = async (req, res) => {
  try {
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

// Logout (optional - can be handled on frontend)
export const adminLogout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
};