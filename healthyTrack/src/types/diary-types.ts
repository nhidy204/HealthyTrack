export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
    _id: string;
    name: string;
    amount: string;       
    calories: number;
    mealType: MealType;
    date: string; // ISO date "YYYY-MM-DD"
    createdAt: string;
}

export interface CreateFoodEntryPayload {
    name: string;
    amount: string;
    calories: number;
    mealType: MealType;
    date: string;
}

export interface MealGroup {
    mealType: MealType;
    icon: string;
    label: string;
    foods: FoodEntry[];
    totalCalories: number;
}

export const MEAL_META: Record<MealType, { icon: string; label: string }> = {
    breakfast: { icon: '🌅', label: 'Bữa sáng' },
    lunch: { icon: '☀', label: 'Bữa trưa' },
    dinner: { icon: '🌙', label: 'Bữa tối' },
    snack: { icon: '🍎', label: 'Ăn vặt' },
};

export const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];