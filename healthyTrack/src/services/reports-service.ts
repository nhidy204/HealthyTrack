import api from './auth-service';
import type { WeeklyReport } from '@typing/reports-types';
import type { SidebarStats } from '@typing/reports-types';

export const reportsService = {
  getWeeklyReport: async (weekOffset = 0): Promise<WeeklyReport> => {
    const { data } = await api.get<WeeklyReport>(`/reports/weekly?offset=${weekOffset}`);
    return data;
  },

  getSidebarStats: async (weekOffset = 0): Promise<SidebarStats> => {
    const { data } = await api.get<SidebarStats>(`/reports/sidebar?offset=${weekOffset}`);
    return data;
  },
};