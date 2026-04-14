export interface WeeklyReport {
  startDate: string;
  endDate: string;
  avgCalories: number;
  targetCalories: number;
  weightStart: number;
  weightEnd: number;
  weightChange: number;
  dailyCalories: { date: string; calories: number }[];
  dailyWeights: { date: string; weight: number }[];
}

export interface SidebarStats {
  streak: number;
  maxStreak: number;
  last7Logged: boolean[];
  goalDays: number;
  totalDays: number;
  weekDays: { date: string; status: 'ok' | 'over' | 'none' }[];
  topFoods: { name: string; count: number }[];
  comparison: {
    prevAvg: number;
    thisAvg: number;
    diff: number;
  };
}
