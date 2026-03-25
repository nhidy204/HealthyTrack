import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
    isDark: boolean;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            isDark: false,
            toggleTheme: () => {
                const next = !get().isDark;
                set({ isDark: next });
                document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
            },
        }),
        { name: 'vitatrack-theme' }
    )
);