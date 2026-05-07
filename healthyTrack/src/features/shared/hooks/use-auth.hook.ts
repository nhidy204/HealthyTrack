import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@shared/services/auth.service';
import { useAuthStore } from '@auth/auth.store';
import type { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload } from '@auth/auth.types';

export function useLogin() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: ({ user, token }) => {
            // Clear old token from localStorage before setting new one to prevent token collision
            localStorage.removeItem('vitatrack-auth');
            // Update auth store with new user and token
            setAuth(user, token);
            // Redirect: nếu chưa có basic info → onboarding, ngược lại → dashboard
            navigate('/onboarding');
        },
    });
}

export function useRegister() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: (payload: RegisterPayload) => authService.register(payload),
        onSuccess: ({ user, token }) => {
            console.log('Register success, received user:', user);
            console.log('Token from register:', token.substring(0, 20) + '...');
            
            // Clear old token from localStorage before setting new one to prevent token collision
            localStorage.removeItem('vitatrack-auth');
            // Update auth store with new user and token
            setAuth(user, token);
            console.log('Auth store updated. Store user:', useAuthStore.getState().user);
            console.log('Auth store token:', useAuthStore.getState().token?.substring(0, 20) + '...');
            
            // Redirect to onboarding
            navigate('/onboarding');
        },
    });
}

export function useCheckUsername() {
    return useMutation({
        mutationFn: (username: string) => authService.checkUsername(username),
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordPayload) =>
            authService.forgotPassword(payload),
    });
}

export function useResetPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) =>
            authService.resetPassword(payload),
        onSuccess: () => {
            navigate('/login');
        },
    });
}



