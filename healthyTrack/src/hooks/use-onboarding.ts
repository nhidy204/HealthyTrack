import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboardingService, type OnboardingPayload } from '../services/onboarding-service';

export const PROFILE_KEY = ['profile'];

export function useProfile() {
    return useQuery({
        queryKey: PROFILE_KEY,
        queryFn: onboardingService.getProfile,
        retry: false,
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