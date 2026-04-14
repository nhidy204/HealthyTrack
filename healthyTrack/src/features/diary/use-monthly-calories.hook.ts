import { useQuery } from '@tanstack/react-query';
import { diaryService } from '@shared/services/diary-service';
import { MONTHLY_KEY } from '@diary/use-diary.hook';

export function useMonthlyCalories(year: number, month: number) {
  return useQuery({
    queryKey: MONTHLY_KEY(year, month),  // month là 0-based (từ getMonth())
    queryFn: () => diaryService.getMonthlyCalories(year, month),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}


