import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports-service';

export function useWeeklyReport(weekOffset = 0) {
  return useQuery({
    queryKey: ['reports', 'weekly', weekOffset],
    queryFn: () => reportsService.getWeeklyReport(weekOffset),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSidebarStats(weekOffset = 0) {
  return useQuery({
    queryKey: ['reports', 'sidebar', weekOffset],
    queryFn: () => reportsService.getSidebarStats(weekOffset),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}