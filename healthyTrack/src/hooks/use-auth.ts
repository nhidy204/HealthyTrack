import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/auth-service';
import { useAuthStore } from '@store/auth-store';
import type { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload } from '@typing/auth-types';

export function useLogin() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: ({ user, token }) => {
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
            setAuth(user, token);
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