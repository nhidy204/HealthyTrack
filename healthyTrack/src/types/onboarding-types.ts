export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

export interface BasicInfo {
    gender: Gender;
    age: number;
    height: number;  
    weight: number;   
}

export interface OnboardingForm extends BasicInfo {
    goal: Goal;
    activityLevel: ActivityLevel;
}

export interface NutritionPlan {
    bmr: number;
    tdee: number;
    targetCalories: number;
    goal: Goal;
}

export const ACTIVITY_OPTIONS: {
    value: ActivityLevel;
    label: string;
    description: string;
}[] = [
        { value: 1.2, label: 'Không vận động (×1.2)', description: 'Ngồi nhiều, ít đi lại' },
        { value: 1.375, label: 'Nhẹ (×1.375)', description: 'Tập 1–3 buổi/tuần' },
        { value: 1.55, label: 'Vừa phải (×1.55)', description: 'Tập 3–5 buổi/tuần' },
        { value: 1.725, label: 'Năng động (×1.725)', description: 'Tập 6–7 buổi/tuần' },
        { value: 1.9, label: 'Rất năng động (×1.9)', description: 'Tập nặng 2 lần/ngày' },
    ];

export const GOAL_OPTIONS: {
    value: Goal;
    icon: string;
    label: string;
    description: string;
}[] = [
        { value: 'lose', icon: '↓', label: 'Giảm cân', description: 'TDEE − 400 kcal' },
        { value: 'maintain', icon: '⟳', label: 'Duy trì', description: 'Giữ nguyên TDEE' },
        { value: 'gain', icon: '↑', label: 'Tăng cân', description: 'TDEE + 400 kcal' },
    ];