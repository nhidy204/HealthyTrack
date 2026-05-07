import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboardingService, type OnboardingPayload } from '@shared/services/onboarding.service';
import { useAuthStore } from '@auth/auth.store';

export const PROFILE_KEY = ['profile'];

/**
 * Hook to fetch user profile
 * Optional: set `skipCheck=true` to disable query (e.g., during login/register)
 */
export function useProfile(skipCheck = false) {
    const user = useAuthStore((s) => s.user);
    
    return useQuery({
        queryKey: PROFILE_KEY,
        queryFn: onboardingService.getProfile,
        retry: false,
        // Only run query if user is authenticated AND not skipping check
        enabled: !skipCheck && !!user,
    });
}

export function useSaveProfile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: OnboardingPayload) => onboardingService.saveProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
            navigate('/dashboard');
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Partial<OnboardingPayload>) =>
            onboardingService.updateProfile(payload),
        onSuccess: () => {
            // Invalidate để tính lại TDEE ngay lập tức
            queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
        },
    });
}


