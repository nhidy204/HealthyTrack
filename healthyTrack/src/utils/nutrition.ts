import type { BasicInfo, Goal, ActivityLevel, NutritionPlan } from '../types/onboarding-types';

/**
 * Mifflin-St Jeor Equation
 * Nam:  BMR = 10×weight + 6.25×height − 5×age + 5
 * Nữ:   BMR = 10×weight + 6.25×height − 5×age − 161
 */
export function calcBMR({ gender, weight, height, age }: BasicInfo): number {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? base + 5 : base - 161;
}

/** TDEE = BMR × activity multiplier */
export function calcTDEE(bmr: number, activityLevel: ActivityLevel): number {
    return bmr * activityLevel;
}

/** Target calories based on goal (±400 kcal) */
export function calcTargetCalories(tdee: number, goal: Goal): number {
    if (goal === 'lose') return tdee - 400;
    if (goal === 'gain') return tdee + 400;
    return tdee;
}

/** Calculate full nutrition plan */
export function calcNutritionPlan(
    basicInfo: BasicInfo,
    goal: Goal,
    activityLevel: ActivityLevel
): NutritionPlan {
    const bmr = Math.round(calcBMR(basicInfo));
    const tdee = Math.round(calcTDEE(bmr, activityLevel));
    const targetCalories = Math.round(calcTargetCalories(tdee, goal));
    return { bmr, tdee, targetCalories, goal };
}

/** Human-readable goal label */
export function goalLabel(goal: Goal): string {
    const map: Record<Goal, string> = {
        lose: 'giảm cân',
        maintain: 'duy trì cân nặng',
        gain: 'tăng cân',
    };
    return map[goal];
}