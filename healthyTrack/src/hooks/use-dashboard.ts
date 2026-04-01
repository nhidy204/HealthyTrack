import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
//useQuery --> lấy đọc dl từ server về
//useMutation --> gửi (thêm, sửa xóa) dữ liệu lên server
//useQueryClient --> can thiệp vô bộ nhớ đệm (cache) của udung
import { dashboardService } from '../services/dashboard-service';

const today = () => new Date().toISOString().split('T')[0];

export const DASHBOARD_KEYS = {
    //react-query lưu trữ dữ liệu như nhãn dán --> tìm cho dễ 
    summary: (date: string) => ['dashboard', 'summary', date],
    weightHistory: (days: number) => ['dashboard', 'weight', days],
    water: (date: string) => ['dashboard', 'water', date],
};

export function useDailySummary(date = today()) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.summary(date),
        queryFn: () => dashboardService.getDailySummary(date), //cách để gọi api
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
    const qc = useQueryClient(); //lấy cc qly cache
    return useMutation({
        mutationFn: ({ weight, date }: { weight: number; date?: string }) => //gửi tt mới lên server
            dashboardService.logWeight(weight, date),
        onSuccess: () => {
            //invalidateQueries --> đánh dấu dl đã thiu --> đi lấy bản mới về ngay cả ở bdo, tquan ngày, hồ sư
            qc.invalidateQueries({ queryKey: ['dashboard', 'weight'] });
            qc.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
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
    return useMutation({ //gửi số ly mới lên server
        mutationFn: ({ glasses, date }: { glasses: number; date?: string }) =>
            dashboardService.logWater(glasses, date),
        onSuccess: () => { //thành công thì tải lại dữ liệu để đẩy bar
            qc.invalidateQueries({ queryKey: ['dashboard', 'water'] });
        },
    });
}