/**
 * Onboarding validation schemas using Zod
 */

import { z } from 'zod';
import type { Gender, Goal, ActivityLevel } from '@onboarding/onboarding.types';

/**
 * Basic info form (step 1)
 */
export const basicInfoSchema = z.object({
  gender: z.enum(['male', 'female'] as const, {
    errorMap: () => ({ message: 'Please select a gender' }),
  }) as z.ZodType<Gender>,
  age: z
    .number()
    .int('Age must be a whole number')
    .min(13, 'You must be at least 13 years old')
    .max(120, 'Please enter a valid age'),
  height: z
    .number()
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must be at most 250 cm'),
  weight: z
    .number()
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight must be at most 300 kg'),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

/**
 * Goals form (step 2)
 */
export const goalsSchema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain'] as const, {
    errorMap: () => ({ message: 'Please select a goal' }),
  }) as z.ZodType<Goal>,
  activityLevel: z
    .number({
      errorMap: () => ({ message: 'Please select an activity level' }),
    })
    .refine((val) => [1.2, 1.375, 1.55, 1.725, 1.9].includes(val), {
      message: 'Please select a valid activity level',
    }) as z.ZodType<ActivityLevel>,
});

export type GoalsFormData = z.infer<typeof goalsSchema>;

/**
 * Complete onboarding form
 */
export const onboardingSchema = basicInfoSchema.merge(goalsSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;



