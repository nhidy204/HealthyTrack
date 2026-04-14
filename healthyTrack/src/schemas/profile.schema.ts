/**
 * Profile validation schemas using Zod
 */

import { z } from 'zod';

/**
 * Update profile form validation
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email must be at most 100 characters'),
  gender: z.enum(['male', 'female'] as const, {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
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
  goal: z.enum(['lose', 'maintain', 'gain'] as const, {
    errorMap: () => ({ message: 'Please select a goal' }),
  }),
  activityLevel: z
    .enum(['1.2', '1.375', '1.55', '1.725', '1.9'] as const, {
      errorMap: () => ({ message: 'Please select an activity level' }),
    })
    .transform((val) => parseFloat(val) as 1.2 | 1.375 | 1.55 | 1.725 | 1.9),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * Change password form validation
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be at most 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
