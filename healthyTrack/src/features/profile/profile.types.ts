import type { ActivityLevel } from '@onboarding/onboarding.types';

export interface UpdateProfilePayload {
    firstName: string;
    lastName: string;
    email: string;
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    goal: 'lose' | 'maintain' | 'gain';
    activityLevel: ActivityLevel;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}


