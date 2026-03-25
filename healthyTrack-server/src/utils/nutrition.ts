import type { Gender, Goal } from '../models/profile';

export function calcBMR(gender: Gender, weight: number, height: number, age: number): number {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(gender === 'male' ? base + 5 : base - 161);
}

export function calcTDEE(bmr: number, activityLevel: number): number {
    return Math.round(bmr * activityLevel);
}

export function calcTargetCalories(tdee: number, goal: Goal): number {
    if (goal === 'lose') return Math.round(tdee - 400);
    if (goal === 'gain') return Math.round(tdee + 400);
    return tdee;
}