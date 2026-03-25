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