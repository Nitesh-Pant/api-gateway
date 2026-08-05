import  {Router} from 'express';
import {login, registerUser, getUserProfile} from '../controllers/user.controller.js';
import authMiddleware from '../middleware/user.auth.middleware.js';

const router = Router();


router.post('/register', registerUser);
router.post('/login', login);
router.get('/:id', authMiddleware, getUserProfile);


export default router;
