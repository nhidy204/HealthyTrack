import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@auth/auth.types';

interface AuthStore extends AuthState {
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) =>
                set({ user, token, isAuthenticated: true }),

            logout: () => {
                // Clear localStorage to ensure complete session cleanup
                localStorage.removeItem('vitatrack-auth');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        { name: 'vitatrack-auth' }
    )
);


