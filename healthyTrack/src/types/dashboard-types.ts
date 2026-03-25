export interface DailySummary {
    date: string; // ISO date string
    totalCalories: number;
    targetCalories: number;
    remainingCalories: number;
    percentComplete: number;
    weight?: number;
}

export interface WeightLog {
    date: string;
    weight: number;
}

export interface WaterLog {
    date: string;
    glasses: number;        
}

export interface ExerciseLog {
    date: string;
    minutes: number;      
}