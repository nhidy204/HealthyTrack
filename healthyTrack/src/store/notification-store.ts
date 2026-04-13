import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationStore {
  waterReminderEnabled: boolean;
  setWaterReminder: (val: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      waterReminderEnabled: false,
      setWaterReminder: (val) => set({ waterReminderEnabled: val }),
    }),
    { name: 'notification-settings' }
  )
);