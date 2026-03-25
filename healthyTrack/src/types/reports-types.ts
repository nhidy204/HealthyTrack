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