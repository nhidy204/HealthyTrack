import { useAuthStore } from '@auth/auth.store';
import { useThemeStore } from '@shared/store/theme-store';
import { useNotificationStore } from '@shared/store/notification-store';


//Hook to safely access auth store with selectors
//Prevents unnecessary re-renders from whole-store changes
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  return { user, isAuthenticated, token, setAuth, logout };
};

//Hook to safely access theme store with selectors
export const useTheme = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return { isDark, toggleTheme };
};


//Hook to safely access notification store with selectors
//NotificationStore manages water reminder preferences
export const useNotifications = () => {
  const waterReminderEnabled = useNotificationStore(
    (state) => state.waterReminderEnabled
  );
  const setWaterReminder = useNotificationStore(
    (state) => state.setWaterReminder
  );

  return { waterReminderEnabled, setWaterReminder };
};



