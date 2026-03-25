import { Router } from 'express';
import { register, login, checkUsername, forgotPassword, resetPassword, changePassword } from '../controllers/auth-controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-username', checkUsername);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);

export default router;