import { Router } from 'express';
import { getEntries, addEntry, updateEntry, deleteEntry, getMonthlyCalories } from '../controllers/diary-controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/monthly', getMonthlyCalories);
router.get('/', getEntries);
router.post('/', addEntry);
router.patch('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;