import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diaryService } from '@shared/services/diary-service';
import type { CreateFoodEntryPayload, MealGroup, FoodEntry } from '@diary/diary.types';
import { MEAL_META, MEAL_ORDER } from '@diary/diary.types';
import { DASHBOARD_KEYS } from '@dashboard/use-dashboard.hook';

export const DIARY_KEY = (date: string) => ['diary', date];
export const MONTHLY_KEY = (year: number, month: number) => ['diary', 'monthly', year, month];

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


