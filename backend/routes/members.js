import express from 'express';
import { 
    getMembers, 
    addMember, 
    updateMember, 
    deleteMember, 
    verifyMember,
    updateMemberPickStatus
} from '../controllers/MemberController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


console.log('Members router loaded');

router.post('/verify', (req, res) => {
  console.log('Verify route hit');
  res.json({ test: 'verify works' });
});

// Specific routes FIRST (before dynamic :id routes)
router.post('/verify', verifyMember);
router.put('/pick/:id', verifyToken, updateMemberPickStatus);

// Protected routes - require admin authentication
router.get('/', verifyToken, getMembers);
router.post('/', verifyToken, addMember);
router.put('/:id', verifyToken, updateMember);  
router.delete('/:id', verifyToken, deleteMember);

export default router;