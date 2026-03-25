import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports-service';

export function useWeeklyReport(weekOffset = 0) {
    return useQuery({
        queryKey: ['reports', 'weekly', weekOffset],
        queryFn: () => reportsService.getWeeklyReport(weekOffset),
        staleTime: 1000 * 60 * 5,
    });
}