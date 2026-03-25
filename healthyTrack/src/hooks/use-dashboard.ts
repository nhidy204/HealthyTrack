import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';

const today = () => new Date().toISOString().split('T')[0];

export const DASHBOARD_KEYS = {
    summary: (date: string) => ['dashboard', 'summary', date],
    weightHistory: (days: number) => ['dashboard', 'weight', days],
    water: (date: string) => ['dashboard', 'water', date],
};

export function useDailySummary(date = today()) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.summary(date),
        queryFn: () => dashboardService.getDailySummary(date),
        staleTime: 1000 * 60,   // 1 min — re-fetch sau diary updates
    });
}

export function useWeightHistory(days = 7) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.weightHistory(days),
        queryFn: () => dashboardService.getWeightHistory(days),
    });
}

export function useLogWeight() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ weight, date }: { weight: number; date?: string }) =>
            dashboardService.logWeight(weight, date),
        onSuccess: () => {
            // invalidate weight history + daily summary (cân nặng hiển thị ở summary)
            qc.invalidateQueries({ queryKey: ['dashboard', 'weight'] });
            qc.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
            // cũng invalidate profile để TDEE tính lại --> nếu cần thì tính ko thì thôi
            qc.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

export function useWaterLog(date = today()) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.water(date),
        queryFn: () => dashboardService.getWaterLog(date),
    });
}

export function useLogWater() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ glasses, date }: { glasses: number; date?: string }) =>
            dashboardService.logWater(glasses, date),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['dashboard', 'water'] });
        },
    });
}