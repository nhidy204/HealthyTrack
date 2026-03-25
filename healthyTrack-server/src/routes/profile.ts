import { Router } from 'express';
import { setupProfile, getProfile, updateProfile } from '../controllers/profile-controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/setup', setupProfile);
router.get('/', getProfile);
router.patch('/', updateProfile);

export default router;