import api from '@shared/services/auth.service';
import type { DailySummary, WeightLog, WaterLog } from '@dashboard/dashboard.types';

const today = () => new Date().toISOString().split('T')[0];

export const dashboardService = {
    getDailySummary: async (date = today()): Promise<DailySummary> => {
        const { data } = await api.get<DailySummary>(`/dashboard/summary?date=${date}`);
        return data;
    },

    logWeight: async (weight: number, date = today()): Promise<WeightLog> => {
        const { data } = await api.post<WeightLog>('/logs/weight', { weight, date });
        return data;
    },

    getWeightHistory: async (days = 7): Promise<WeightLog[]> => {
        const { data } = await api.get<WeightLog[]>(`/logs/weight?days=${days}`);
        return data;
    },

    logWater: async (glasses: number, date = today()): Promise<WaterLog> => {
        const { data } = await api.post<WaterLog>('/logs/water', { glasses, date });
        return data;
    },

    getWaterLog: async (date = today()): Promise<WaterLog> => {
        const { data } = await api.get<WaterLog>(`/logs/water?date=${date}`);
        return data;
    },
};



