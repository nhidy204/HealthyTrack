import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/auth-service';
import { PROFILE_KEY } from './use-onboarding';
import type { UpdateProfilePayload, ChangePasswordPayload } from '../types/profile-types';

export function useUpdateUserProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) =>
            api.patch('/profile', payload).then(r => r.data),
        onSuccess: () => {
            // invalidate profile --> TDEE tính lại ngay lập tức
            qc.invalidateQueries({ queryKey: PROFILE_KEY });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) =>
            api.post('/auth/change-password', payload).then(r => r.data),
    });
}