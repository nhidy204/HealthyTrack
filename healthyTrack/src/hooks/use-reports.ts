import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports-service';

export function useWeeklyReport(weekOffset = 0) { //weekOffset: 0 --> tuần này, -1 --> tuần trước, +1 -->tuần sau
    return useQuery({
        queryKey: ['reports', 'weekly', weekOffset],
        queryFn: () => reportsService.getWeeklyReport(weekOffset),
        staleTime: 1000 * 60 * 5, //đặt 5' cho tkiem tnguyen cho server, kiểu bấm qua bấm lại giữa các tuần trong vòng 5 phút sẽ hiện lên nhanh
    });
}