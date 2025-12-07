import express from 'express';
import { adminLogin, getAdminProfile, adminLogout } from '../controllers/AdminController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
// Frontend calls: POST /api/admin/login
// Vite proxy removes /api, so server receives: POST /admin/login
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

// Protected routes
// Frontend calls: GET /api/admin/profile with Authorization header
router.get('/profile', verifyToken, getAdminProfile);

export default router;