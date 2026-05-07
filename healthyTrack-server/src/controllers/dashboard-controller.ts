import { Response } from 'express';
import FoodEntry from '../models/food-entry';
import WeightLog from '../models/weight-log';
import WaterLog from '../models/water-log';
import Profile from '../models/profile';
import type { AuthRequest } from '../middleware/auth';

// GET /api/dashboard/summary?date=YYYY-MM-DD
export async function getDailySummary(req: AuthRequest, res: Response) {
    try {
        const date = (req.query.date as string) ?? new Date().toISOString().split('T')[0];

        const [entries, weightLog, waterLog, profile] = await Promise.all([
            FoodEntry.find({ user: req.userId, date }),
            WeightLog.findOne({ user: req.userId, date }),
            WaterLog.findOne({ user: req.userId, date }),
            Profile.findOne({ user: req.userId }),
        ]);

        const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
        const targetCalories = profile?.targetCalories ?? 0;

        return res.json({
            date,
            totalCalories,
            targetCalories,
            remainingCalories: Math.max(0, targetCalories - totalCalories),
            percentComplete: targetCalories > 0 ? Math.round((totalCalories / targetCalories) * 100) : 0,
            weight: weightLog?.weight ?? null,
            glasses: waterLog?.glasses ?? 0,
        });
    } catch {
        return res.status(500).json({ message: 'Lỗi lấy tổng quan ngày.' });
    }
}

// POST /api/logs/weight
export async function logWeight(req: AuthRequest, res: Response) {
    try {
        const { weight, date } = req.body;
        const log = await WeightLog.findOneAndUpdate(
            { user: req.userId, date },
            { user: req.userId, weight, date },
            { upsert: true, returnDocument: 'after' }
        );
        // Also update profile weight
        await Profile.findOneAndUpdate({ user: req.userId }, { weight });
        return res.json(log);
    } catch {
        return res.status(400).json({ message: 'Lỗi lưu cân nặng.' });
    }
}

// GET /api/logs/weight?days=7
export async function getWeightHistory(req: AuthRequest, res: Response) {
    try {
        const days = parseInt(req.query.days as string) || 7;
        const since = new Date();
        since.setDate(since.getDate() - days + 1);
        const sinceStr = since.toISOString().split('T')[0];

        const logs = await WeightLog.find({
            user: req.userId,
            date: { $gte: sinceStr },
        }).sort({ date: 1 });

        return res.json(logs);
    } catch {
        return res.status(500).json({ message: 'Lỗi lấy lịch sử cân nặng.' });
    }
}

// POST /api/logs/water
export async function logWater(req: AuthRequest, res: Response) {
    try {
        const { glasses, date } = req.body;
        const log = await WaterLog.findOneAndUpdate(
            { user: req.userId, date },
            { user: req.userId, glasses, date },
            { upsert: true, returnDocument: 'after' }
        );
        return res.json(log);
    } catch {
        return res.status(400).json({ message: 'Lỗi lưu lượng nước.' });
    }
}

// GET /api/logs/water?date=YYYY-MM-DD
export async function getWaterLog(req: AuthRequest, res: Response) {
    try {
        const date = (req.query.date as string) ?? new Date().toISOString().split('T')[0];
        const log = await WaterLog.findOne({ user: req.userId, date });
        return res.json(log ?? { date, glasses: 0 });
    } catch {
        return res.status(500).json({ message: 'Lỗi lấy log nước.' });
    }
}