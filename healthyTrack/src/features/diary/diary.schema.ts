/**
 * Diary validation schemas using Zod
 */

import { z } from 'zod';
import type { MealType } from '@diary/diary.types';

/**
 * Create food entry form validation
 */
export const createFoodEntrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên món.')
    .max(100, 'Tên món không quá 100 ký tự.'),
  amount: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập khẩu phần.')
    .max(50, 'Khẩu phần không quá 50 ký tự.'),
  calories: z
    .number({ invalid_type_error: 'Calo phải là số.' })
    .nonnegative('Calo không âm.')
    .int('Calo phải là số nguyên.')
    .max(10000, 'Calo tối đa 10000.')
    .refine((val) => !isNaN(val), 'Vui lòng nhập calo.'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'] as const, {
    errorMap: () => ({ message: 'Loại bữa ăn không hợp lệ.' }),
  }) as z.ZodType<MealType>,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phải là YYYY-MM-DD.')
    .refine(
      (date) => !isNaN(Date.parse(date)),
      'Ngày không hợp lệ.'
    ),
});

export type CreateFoodEntryFormData = z.infer<typeof createFoodEntrySchema>;

/**
 * Add food to meal modal form (only user input fields)
 * mealType and date are passed as props from parent, not form fields
 */
export const addFoodModalSchema = createFoodEntrySchema.omit({ date: true, mealType: true });

export type AddFoodModalFormData = z.infer<typeof addFoodModalSchema>;



