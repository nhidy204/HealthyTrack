import { Response } from 'express';
import FoodEntry from '../models/food-entry';
import WeightLog from '../models/weight-log';
import Profile from '../models/profile';
import type { AuthRequest } from '../middleware/auth';

function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekRange(offsetWeeks: number): { startDate: string; endDate: string } {
  const now = new Date();
  now.setDate(now.getDate() + offsetWeeks * 7);
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { startDate: toIsoLocal(monday), endDate: toIsoLocal(sunday) };
}

// GET /api/reports/weekly?offset=0
export async function getWeeklyReport(req: AuthRequest, res: Response) {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const { startDate, endDate } = getWeekRange(offset);

    const [entries, weightLogs, profile] = await Promise.all([
      FoodEntry.find({ user: req.userId, date: { $gte: startDate, $lte: endDate } }),
      WeightLog.find({ user: req.userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }),
      Profile.findOne({ user: req.userId }),
    ]);

    const caloMap: Record<string, number> = {};
    entries.forEach((e) => {
      caloMap[e.date] = (caloMap[e.date] ?? 0) + e.calories;
    });

    const dailyCalories = [];
    const dailyWeights = [];
    const monday = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = toIsoLocal(d);
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
      startDate, endDate, avgCalories,
      targetCalories: profile?.targetCalories ?? 0,
      weightStart, weightEnd, weightChange,
      dailyCalories, dailyWeights,
    });
  } catch {
    return res.status(500).json({ message: 'Lỗi lấy báo cáo tuần.' });
  }
}

// GET /api/reports/sidebar?offset=0
export async function getSidebarStats(req: AuthRequest, res: Response) {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const { startDate, endDate } = getWeekRange(offset);
    const { startDate: prevStart, endDate: prevEnd } = getWeekRange(offset - 1);

    const profile = await Profile.findOne({ user: req.userId });
    const targetCalories = profile?.targetCalories ?? 0;

    // streak
    let streak = 0;
    const last7: boolean[] = [];

    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = toIsoLocal(d);
      const count = await FoodEntry.countDocuments({ user: req.userId, date: iso });
      const hasEntry = count > 0;
      if (i < 7) last7.unshift(hasEntry);
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // max streak --> tính riêng
    let maxStreak = 0;
    let tempStreak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const count = await FoodEntry.countDocuments({ user: req.userId, date: toIsoLocal(d) });
      if (count > 0) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const [thisWeekEntries, prevEntries] = await Promise.all([
      FoodEntry.find({ user: req.userId, date: { $gte: startDate, $lte: endDate } }),
      FoodEntry.find({ user: req.userId, date: { $gte: prevStart, $lte: prevEnd } }),
    ]);

    const thisCaloMap: Record<string, number> = {};
    thisWeekEntries.forEach((e) => {
      thisCaloMap[e.date] = (thisCaloMap[e.date] ?? 0) + e.calories;
    });

    // Goal days + weekDays status
    const monday = new Date(startDate);
    const weekDays: { date: string; status: 'ok' | 'over' | 'none' }[] = [];
    let goalDays = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = toIsoLocal(d);
      const kcal = thisCaloMap[iso] ?? 0;
      let status: 'ok' | 'over' | 'none' = 'none';
      if (kcal > 0 && kcal <= targetCalories) { status = 'ok'; goalDays++; }
      else if (kcal > targetCalories) { status = 'over'; }
      weekDays.push({ date: iso, status });
    }

    // Top foods
    const foodCount: Record<string, number> = {};
    thisWeekEntries.forEach((e) => {
      foodCount[e.name] = (foodCount[e.name] ?? 0) + 1;
    });
    const topFoods = Object.entries(foodCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Comparison
    const prevCaloMap: Record<string, number> = {};
    prevEntries.forEach((e) => {
      prevCaloMap[e.date] = (prevCaloMap[e.date] ?? 0) + e.calories;
    });
    const prevActive = Object.values(prevCaloMap).filter(v => v > 0);
    const thisActive = Object.values(thisCaloMap).filter(v => v > 0);
    const prevAvg = prevActive.length
      ? Math.round(prevActive.reduce((s, v) => s + v, 0) / prevActive.length) : 0;
    const thisAvg = thisActive.length
      ? Math.round(thisActive.reduce((s, v) => s + v, 0) / thisActive.length) : 0;

    return res.json({
      streak, maxStreak, last7Logged: last7,
      goalDays, totalDays: 7, weekDays,
      topFoods,
      comparison: { prevAvg, thisAvg, diff: thisAvg - prevAvg },
    });
  } catch (err) {
    console.error('Sidebar stats error:', err);
    return res.status(500).json({ message: 'Lỗi lấy thống kê sidebar.' });
  }
}