import { Response } from 'express';
import FoodEntry from '../models/food-entry';
import type { AuthRequest } from '../middleware/auth';

// GET /api/diary?date=YYYY-MM-DD
export async function getEntries(req: AuthRequest, res: Response) {
    try {
        const date = (req.query.date as string) ?? new Date().toISOString().split('T')[0];
        const entries = await FoodEntry.find({ user: req.userId, date }).sort({ createdAt: 1 });
        return res.json(entries);
    } catch {
        return res.status(500).json({ message: 'Lỗi lấy nhật ký.' });
    }
}

// POST /api/diary
export async function addEntry(req: AuthRequest, res: Response) {
    try {
        const { name, amount, calories, mealType, date } = req.body;
        if (!name || !amount || calories == null || !mealType || !date) {
            return res.status(400).json({ message: 'Thiếu thông tin món ăn.' });
        }
        const entry = await FoodEntry.create({ user: req.userId, name, amount, calories, mealType, date });
        return res.status(201).json(entry);
    } catch {
        return res.status(400).json({ message: 'Lỗi thêm món ăn.' });
    }
}

// PATCH /api/diary/:id
export async function updateEntry(req: AuthRequest, res: Response) {
    try {
        const entry = await FoodEntry.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!entry) return res.status(404).json({ message: 'Không tìm thấy món ăn.' });
        return res.json(entry);
    } catch {
        return res.status(400).json({ message: 'Lỗi cập nhật món ăn.' });
    }
}

// DELETE /api/diary/:id
export async function deleteEntry(req: AuthRequest, res: Response) {
    try {
        const entry = await FoodEntry.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!entry) return res.status(404).json({ message: 'Không tìm thấy món ăn.' });
        return res.json({ message: 'Đã xóa món ăn.' });
    } catch {
        return res.status(500).json({ message: 'Lỗi xóa món ăn.' });
    }
}

// GET /api/diary/monthly?year=2026&month=3
export async function getMonthlyCalories(req: AuthRequest, res: Response) {
  try {
    const year  = parseInt(req.query.year as string);
    const month = parseInt(req.query.month as string);

    if (isNaN(year) || isNaN(month)) {
      return res.status(400).json({ message: 'year và month không hợp lệ.' });
    }

    const monthStr = String(month).padStart(2, '0');

    const entries = await FoodEntry.find({
      user: req.userId,
      date: { $regex: `^${year}-${monthStr}` }
    });

    const result: Record<string, number> = {};

    for (const e of entries) {
      result[e.date] = (result[e.date] ?? 0) + e.calories;
    }

    return res.json(result);

  } catch {
    return res.status(500).json({ message: 'Lỗi lấy dữ liệu tháng.' });
  }
}