import  {Router} from 'express';
import {login, registerUser, getUserProfile, getAllUsers} from '../controllers/user.controller.js';
import authMiddleware from '../middleware/user.auth.middleware.js';

const router = Router();


router.post('/register', registerUser);
router.post('/login', login);
router.get('/:id', /* authMiddleware, */ getUserProfile); // auth removed as it is handled in api-gateway-dwarpal
router.get('/a/users', /* authMiddleware, */ getAllUsers);


export default router;
