import { Response } from 'express';
import FoodEntry from '../models/food-entry';
import WeightLog from '../models/weight-log';
import Profile from '../models/profile';
import type { AuthRequest } from '../middleware/auth';

// GET /api/reports/weekly?offset=0
export async function getWeeklyReport(req: AuthRequest, res: Response) {
    try {
        const offset = parseInt(req.query.offset as string) || 0;
        
        const now = new Date();
        now.setDate(now.getDate() + offset * 7);
        const day = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const startDate = monday.toISOString().split('T')[0];
        const endDate = sunday.toISOString().split('T')[0];

        const [entries, weightLogs, profile] = await Promise.all([
            FoodEntry.find({ user: req.userId, date: { $gte: startDate, $lte: endDate } }),
            WeightLog.find({ user: req.userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }),
            Profile.findOne({ user: req.userId }),
        ]);

        // Build daily calories map
        const caloMap: Record<string, number> = {};
        entries.forEach((e) => {
            caloMap[e.date] = (caloMap[e.date] ?? 0) + e.calories;
        });

        // Fill all 7 days
        const dailyCalories = [];
        const dailyWeights = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            dailyCalories.push({ date: dateStr, calories: caloMap[dateStr] ?? 0 });
            const wlog = weightLogs.find((w) => w.date === dateStr);
            if (wlog) dailyWeights.push({ date: dateStr, weight: wlog.weight });
        }

        const activeDays = dailyCalories.filter((d) => d.calories > 0);
        const avgCalories = activeDays.length
            ? Math.round(activeDays.reduce((s, d) => s + d.calories, 0) / activeDays.length)
            : 0;

        const weightStart = weightLogs[0]?.weight ?? null;
        const weightEnd = weightLogs[weightLogs.length - 1]?.weight ?? null;
        const weightChange = weightStart && weightEnd
            ? Math.round((weightEnd - weightStart) * 10) / 10
            : 0;

        return res.json({
            startDate,
            endDate,
            avgCalories,
            targetCalories: profile?.targetCalories ?? 0,
            weightStart,
            weightEnd,
            weightChange,
            dailyCalories,
            dailyWeights,
        });
    } catch {
        return res.status(500).json({ message: 'Lỗi lấy báo cáo tuần.' });
    }
}