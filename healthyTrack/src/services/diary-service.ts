import api from './auth-service';
import type { FoodEntry, CreateFoodEntryPayload } from '../types/diary-types';

export const diaryService = {
    getEntries: async (date: string): Promise<FoodEntry[]> => {
        const { data } = await api.get<FoodEntry[]>(`/diary?date=${date}`);
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