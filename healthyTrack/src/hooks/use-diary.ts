import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryService } from '../services/diary-service';
import type { CreateFoodEntryPayload, MealGroup, FoodEntry } from '../types/diary-types';
import { MEAL_META, MEAL_ORDER } from '../types/diary-types';
import { DASHBOARD_KEYS } from './use-dashboard';

export const DIARY_KEY = (date: string) => ['diary', date];

export function useDiaryEntries(date: string) {
    return useQuery({
        queryKey: DIARY_KEY(date),
        queryFn: () => diaryService.getEntries(date),
        staleTime: 1000 * 30,
    });
}

export function groupByMeal(entries: FoodEntry[]): MealGroup[] {
    return MEAL_ORDER.map((mealType) => {
        const foods = entries.filter((e) => e.mealType === mealType);
        return {
            mealType,
            icon: MEAL_META[mealType].icon,
            label: MEAL_META[mealType].label,
            foods,
            totalCalories: foods.reduce((s, f) => s + f.calories, 0),
        };
    });
}

export function useAddFoodEntry(date: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateFoodEntryPayload) => diaryService.addEntry(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: DIARY_KEY(date) });
            // Update dashboard summary so calorie donut refreshes
            qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary(date) });
        },
    });
}

export function useDeleteFoodEntry(date: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => diaryService.deleteEntry(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: DIARY_KEY(date) });
            qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary(date) });
        },
    });
}

export function useUpdateFoodEntry(date: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateFoodEntryPayload> }) =>
            diaryService.updateEntry(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: DIARY_KEY(date) });
            qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary(date) });
        },
    });
}