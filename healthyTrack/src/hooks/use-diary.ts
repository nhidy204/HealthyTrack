import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryService } from '../services/diary-service';
import type { CreateFoodEntryPayload, MealGroup, FoodEntry } from '../types/diary-types';
import { MEAL_META, MEAL_ORDER } from '../types/diary-types';
import { DASHBOARD_KEYS } from './use-dashboard';

export const DIARY_KEY = (date: string) => ['diary', date];
export const MONTHLY_KEY = (year: number, month: number) => ['diary', 'monthly', year, month];

export function useDiaryEntries(date: string) {
    return useQuery({
        queryKey: DIARY_KEY(date),
        queryFn: () => diaryService.getEntries(date),
        staleTime: 1000 * 30,
    });
}

// group food theo meal
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

// ADD FOOD
export function useAddFoodEntry(date: string) {
  const qc = useQueryClient();
  const d = new Date(date);

  return useMutation({
    mutationFn: (payload: CreateFoodEntryPayload) => diaryService.addEntry(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIARY_KEY(date) });
      qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary(date) });
      qc.invalidateQueries({ queryKey: MONTHLY_KEY(d.getFullYear(), d.getMonth()) });
    },
  });
}

export function useDeleteFoodEntry(date: string) {
  const qc = useQueryClient();
  const d = new Date(date);

  return useMutation({
    mutationFn: (id: string) => diaryService.deleteEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIARY_KEY(date) });
      qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary(date) });
      qc.invalidateQueries({ queryKey: MONTHLY_KEY(d.getFullYear(), d.getMonth()) });
    },
  });
}

export function useUpdateFoodEntry(date: string) {
  const qc = useQueryClient();
  const d = new Date(date);

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateFoodEntryPayload> }) =>
      diaryService.updateEntry(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIARY_KEY(date) });
      qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary(date) });
      qc.invalidateQueries({ queryKey: MONTHLY_KEY(d.getFullYear(), d.getMonth()) });
    },
  });
}