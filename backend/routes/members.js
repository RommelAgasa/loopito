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

// Protected routes - require admin authentication

router.get('/', verifyToken, getMembers);
router.post('/', verifyToken, addMember);
router.put('/:id', verifyToken, updateMember);  
router.delete('/:id', verifyToken, deleteMember);

router.post('/verify', verifyMember);
router.put('/pick/:id', verifyToken, updateMemberPickStatus);


export default router;