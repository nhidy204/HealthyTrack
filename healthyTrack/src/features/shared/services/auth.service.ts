import axios from 'axios';
import { useAuthStore } from '@auth/auth.store';
import type {
    LoginPayload,
    RegisterPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
    AuthResponse,
} from '@auth/auth.types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
// Priority: Check Zustand store first, then fallback to localStorage (for app startup)
api.interceptors.request.use((config) => {
    // First try to get token from Zustand store (always fresh when app is running)
    let token = useAuthStore.getState().token;
    
    // Fallback to localStorage during app startup before Zustand hydrates
    if (!token) {
        try {
            const raw = localStorage.getItem('vitatrack-auth');
            if (raw) {
                const parsed = JSON.parse(raw);
                token = parsed?.state?.token;
            }
        } catch {
            // Ignore parse errors
        }
    }
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//auth endpoints 
export const authService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', payload);
        return data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', payload);
        return data;
    },

    checkUsername: async (username: string): Promise<{ available: boolean }> => {
        const { data } = await api.get(`/auth/check-username?username=${username}`);
        return data;
    },

    forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
        const { data } = await api.post('/auth/forgot-password', payload);
        return data;
    },

    resetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
        const { data } = await api.post('/auth/reset-password', payload);
        return data;
    },
};

export default api;

