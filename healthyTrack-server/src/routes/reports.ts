import { Router } from 'express';
import { getWeeklyReport } from '../controllers/reports-controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/weekly', getWeeklyReport);

export default router;