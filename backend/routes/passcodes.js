import express from 'express';
import {
  createPasscode,
  getAllPasscodes,
  deletePasscode,
  verifyPasscode,
} from '../controllers/PasscodeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Admin routes (protected)
router.post('/', verifyToken, createPasscode);
router.get('/', verifyToken, getAllPasscodes);
router.delete('/:id', verifyToken, deletePasscode);

// Public route (for verifying passcode during signup)
router.post('/verify', verifyPasscode);

export default router;