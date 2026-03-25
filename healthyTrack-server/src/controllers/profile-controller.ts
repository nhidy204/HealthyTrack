import { Response } from 'express';
import Profile from '../models/profile';
import User from '../models/user';
import { calcBMR, calcTDEE, calcTargetCalories } from '../utils/nutrition';
import type { AuthRequest } from '../middleware/auth';

// POST /api/profile/setup
export async function setupProfile(req: AuthRequest, res: Response) {
    try {
        const { gender, age, height, weight, goal, activityLevel } = req.body;

        const bmr = calcBMR(gender, weight, height, age);
        const tdee = calcTDEE(bmr, activityLevel);
        const targetCalories = calcTargetCalories(tdee, goal);

        const profile = await Profile.findOneAndUpdate(
            { user: req.userId },
            { user: req.userId, gender, age, height, weight, goal, activityLevel, bmr, tdee, targetCalories },
            { upsert: true, new: true, runValidators: true }
        );

        return res.status(201).json({ profile, plan: { bmr, tdee, targetCalories, goal } });
    } catch (err) {
        return res.status(400).json({ message: 'Lỗi thiết lập hồ sơ.' });
    }
}

// GET /api/profile
export async function getProfile(req: AuthRequest, res: Response) {
    try {
        const profile = await Profile.findOne({ user: req.userId });
        if (!profile) return res.status(404).json({ message: 'Chưa thiết lập hồ sơ.' });
        return res.json(profile);
    } catch {
        return res.status(500).json({ message: 'Lỗi lấy hồ sơ.' });
    }
}

// PATCH /api/profile
export async function updateProfile(req: AuthRequest, res: Response) {
    try {
        const { firstName, lastName, email, gender, age, height, weight, goal, activityLevel } = req.body;

        // Update user info
        if (firstName || lastName || email) {
            await User.findByIdAndUpdate(req.userId, { firstName, lastName, email });
        }

        // Recalculate nutrition
        const bmr = calcBMR(gender, weight, height, age);
        const tdee = calcTDEE(bmr, activityLevel);
        const targetCalories = calcTargetCalories(tdee, goal);

        const profile = await Profile.findOneAndUpdate(
            { user: req.userId },
            { gender, age, height, weight, goal, activityLevel, bmr, tdee, targetCalories },
            { new: true, runValidators: true }
        );

        return res.json(profile);
    } catch {
        return res.status(400).json({ message: 'Lỗi cập nhật hồ sơ.' });
    }
}