import { Router } from 'express';
import { getWeeklyReport, getSidebarStats } from '../controllers/reports-controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/weekly', getWeeklyReport);
router.get('/sidebar', getSidebarStats);

export default router;