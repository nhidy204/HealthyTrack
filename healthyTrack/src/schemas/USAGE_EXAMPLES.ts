/**
 * EXAMPLE: How to use Zod schemas and date utilities
 * This file shows before/after patterns for updating forms
 *
 * Apply these patterns when refactoring existing forms
 */

// ============================================
// EXAMPLE 1: Login Form
// ============================================

// BEFORE: React Hook Form with inline validation
/*
import { useForm } from 'react-hook-form';

export const LoginPageBefore: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('username', { 
          required: 'Username is required',
          minLength: { value: 3, message: 'Min 3 characters' }
        })}
      />
      <input 
        {...register('password', { 
          required: 'Password required',
          minLength: { value: 8, message: 'Min 8 characters' }
        })}
        type="password"
      />
      <button type="submit">Login</button>
    </form>
  );
};
*/

// AFTER: Using Zod schema
/*
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@schemas/auth.schema';

export const LoginPageAfter: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('username')}
        placeholder="Username"
      />
      {errors.username && <span className="error">{errors.username.message}</span>}

      <input 
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span className="error">{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
};
*/

// ============================================
// EXAMPLE 2: Food Entry Form with Date Utils
// ============================================

// BEFORE: Date formatting scattered
/*
export const AddFoodModalBefore: React.FC<{ date: Date }> = ({ date }) => {
  const { register } = useForm();

  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const isoDate = new Date(date).toISOString().split('T')[0];

  return <form>{displayDate} - {isoDate}</form>;
};
*/

// AFTER: Using centralized date utilities
/*
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addFoodModalSchema, type AddFoodModalFormData } from '@schemas/diary.schema';
import { formatDateLong, toISODateString } from '@utils/date';

export const AddFoodModalAfter: React.FC<{ date: Date }> = ({ date }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddFoodModalFormData>({
    resolver: zodResolver(addFoodModalSchema),
  });

  const displayDate = formatDateLong(date, 'en-US');
  const isoDate = toISODateString(date);

  const onSubmit = (data: AddFoodModalFormData) => {
    addFood({ ...data, date: isoDate });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>{displayDate}</h3>

      <input 
        {...register('name')}
        placeholder="Food name"
      />
      {errors.name && <span>{errors.name.message}</span>}

      <input 
        {...register('amount')}
        placeholder="100g, 1 cup, etc"
      />
      {errors.amount && <span>{errors.amount.message}</span>}

      <input 
        {...register('calories', { valueAsNumber: true })}
        type="number"
        placeholder="Calories"
      />
      {errors.calories && <span>{errors.calories.message}</span>}

      <button type="submit">Add Food</button>
    </form>
  );
};
*/

// ============================================
// EXAMPLE 3: Reusable Input Component
// ============================================

/*
import { FC } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import styles from './input-field.module.css';

interface InputFieldProps {
  label: string;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  error,
  type = 'text',
  placeholder,
  register,
}) => (
  <div className={styles.field}>
    <label>{label}</label>
    <input
      {...register}
      type={type}
      placeholder={placeholder}
      className={error ? styles.errorInput : ''}
      aria-invalid={error ? 'true' : 'false'}
    />
    {error && <span className={styles.errorMessage}>{error.message}</span>}
  </div>
);
*/

// Usage in register form:
/*
<InputField
  label="Username"
  error={errors.username}
  placeholder="Choose a username"
  register={register('username')}
/>

<InputField
  label="Email"
  type="email"
  error={errors.email}
  placeholder="your@email.com"
  register={register('email')}
/>
*/

// ============================================
// EXAMPLE 4: Multi-Step Onboarding
// ============================================

/*
import { useState } from 'react';
import { basicInfoSchema, goalsSchema } from '@schemas/onboarding.schema';
import type { BasicInfoFormData, GoalsFormData } from '@schemas/onboarding.schema';

export const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);

  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    setBasicInfo(data);
    setStep(2);
  };

  const handleGoalsSubmit = (data: GoalsFormData) => {
    const complete = { ...basicInfo, ...data };
    // Both are typed safely!
    completeOnboarding(complete);
  };

  return (
    <>
      {step === 1 && <BasicInfoFormStep onSubmit={handleBasicInfoSubmit} />}
      {step === 2 && basicInfo && <GoalsFormStep onSubmit={handleGoalsSubmit} />}
    </>
  );
};
*/

// ============================================
// EXAMPLE 5: Date Utilities in Components
// ============================================

/*
import { formatDateShort, getDayName, addDays, formatCalories } from '@utils/date';

export const DiaryCalendarItem: React.FC<{ date: Date; calories: number }> = ({
  date,
  calories,
}) => (
  <div className="calendar-item">
    <div>
      {getDayName(date, 'vi')}
    </div>
    <div>
      {formatDateShort(date, 'vi')}
    </div>
    <div>
      {formatCalories(calories, 'en-US')}
    </div>
  </div>
);

export const DateNavigation: React.FC = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <button onClick={() => setDate(addDays(date, -1))}>← Previous</button>
      <button onClick={() => setDate(new Date())}>Today</button>
      <button onClick={() => setDate(addDays(date, 1))}>Next →</button>
    </>
  );
};
*/

// ============================================
// TIPS FOR MIGRATION
// ============================================

/*
1. Keep Zod schemas in src/schemas/ folder
2. Use type inference: 
   type LoginFormData = z.infer<typeof loginSchema>
3. Import date utilities from '@utils/date'
4. Always use zodResolver in useForm()
5. Remove inline validation rules from register()
6. Add proper error display using FieldError
7. Use reusable InputField component for consistency
8. Test form validation after migration
9. Keep schemas centralized - don't duplicate validation logic
10. Share schemas between frontend and backend if using same stack

COMMON MISTAKES TO AVOID:
❌ Mixing inline validation with Zod
❌ Formatting dates in components instead of using utils
❌ Creating new schemas instead of using existing ones
❌ Forgetting to add type annotations to form data
❌ Not using zodResolver in useForm
*/

/* ============================================
MIGRATION CHECKLIST
============================================

Auth Forms:
✅ login-page.tsx → loginSchema
✅ register-page.tsx → registerSchema
✅ forgot-password-page.tsx → forgotPasswordSchema
✅ reset-password-page.tsx → resetPasswordSchema

Diary Forms:
✅ add-food-modal.tsx → addFoodModalSchema

Profile Forms:
✅ profile-page.tsx → updateProfileSchema

Onboarding Forms:
✅ basic-info-page.tsx + steps → onboardingSchema

Date Utilities:
- Replace scattered date formatting with functions from @utils/date
- Use getToday(), formatDateLong(), formatDateShort(), etc.

Status: All forms migrated! 🎉
*/
