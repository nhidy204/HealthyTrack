import api from '@shared/services/auth-service';
import type { FoodEntry, CreateFoodEntryPayload } from '@diary/diary.types';

interface MonthlyCalories {
    [date: string]: number;
}

export const diaryService = {
    getEntries: async (date: string): Promise<FoodEntry[]> => {
        const { data } = await api.get<FoodEntry[]>(`/diary?date=${date}`);
        return data;
    },

    getMonthlyCalories: async (year: number, month: number): Promise<MonthlyCalories> => {
        const { data } = await api.get<MonthlyCalories>(`/diary/monthly?year=${year}&month=${month + 1}`);
        return data;
    },

    addEntry: async (payload: CreateFoodEntryPayload): Promise<FoodEntry> => {
        const { data } = await api.post<FoodEntry>('/diary', payload);
        return data;
    },

    deleteEntry: async (id: string): Promise<void> => {
        await api.delete(`/diary/${id}`);
    },

    updateEntry: async (id: string, payload: Partial<CreateFoodEntryPayload>): Promise<FoodEntry> => {
        const { data } = await api.patch<FoodEntry>(`/diary/${id}`, payload);
        return data;
    },
};


