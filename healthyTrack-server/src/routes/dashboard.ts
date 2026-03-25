import { Router } from 'express';
import { getDailySummary, logWeight, getWeightHistory, logWater, getWaterLog } from '../controllers/dashboard-controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

//dashboard summary
router.get('/summary', getDailySummary);

//weight logs
router.post('/weight', logWeight);
router.get('/weight', getWeightHistory);

//water logs
router.post('/water', logWater);
router.get('/water', getWaterLog);

export default router;