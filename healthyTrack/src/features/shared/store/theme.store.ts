import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
    isDark: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            isDark: false,
            toggleTheme: () => {
                const next = !get().isDark;
                set({ isDark: next });
                document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
                document.documentElement.style.colorScheme = next ? 'dark' : 'light';
            },
            initTheme: () => {
                const isDark = get().isDark;
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            },
        }),
        { name: 'vitatrack-theme' }
    )
);
