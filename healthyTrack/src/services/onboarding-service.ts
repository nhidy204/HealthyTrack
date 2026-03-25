import api from './auth-service';
import type { OnboardingForm, NutritionPlan } from '../types/onboarding-types';

export interface OnboardingPayload extends OnboardingForm {
    targetCalories: number;
}

export interface OnboardingResponse {
    profile: OnboardingPayload;
    plan: NutritionPlan;
}

export const onboardingService = {
    saveProfile: async (payload: OnboardingPayload): Promise<OnboardingResponse> => {
        const { data } = await api.post<OnboardingResponse>('/profile/setup', payload);
        return data;
    },

    getProfile: async (): Promise<OnboardingPayload> => {
        const { data } = await api.get<OnboardingPayload>('/profile');
        return data;
    },

    updateProfile: async (payload: Partial<OnboardingPayload>): Promise<OnboardingPayload> => {
        const { data } = await api.patch<OnboardingPayload>('/profile', payload);
        return data;
    },
};