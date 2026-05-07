# Zod Schemas & Date Utilities Guide

This guide explains how to use the new consolidated validation schemas and date utilities in HealthyTrack.

## 🎯 Overview

- **Date Utilities** (`src/utils/date.ts`) - Centralized date formatting functions
- **Auth Schemas** (`src/schemas/auth.schema.ts`) - Login, Register, Password reset
- **Diary Schemas** (`src/schemas/diary.schema.ts`) - Food entry validation
- **Onboarding Schemas** (`src/schemas/onboarding.schema.ts`) - User setup forms
- **Profile Schemas** (`src/schemas/profile.schema.ts`) - Profile update, Password change

---

## 📅 Date Utilities

### Import
```typescript
import { 
  getToday,
  toISODateString,
  addDays,
  formatDateLong,
  formatDateShort,
  getDayName,
  formatCalories,
  formatNumber
} from '@utils/date';
```

### Examples

```typescript
// Get today as ISO string (YYYY-MM-DD)
const today = getToday();  // "2026-04-13"

// Add days to a date
const tomorrow = addDays(new Date(), 1);
const last7Days = addDays(new Date(), -7);

// Format dates
const long = formatDateLong(new Date(), 'en-US');
// "Sunday, 13 April 2026"

const short = formatDateShort(new Date(), 'vi');
// "CN, 13 Thg 4"

// Get day name
const dayName = getDayName('2026-04-13', 'vi');  // "Chủ nhật"

// Format numbers
const calories = formatCalories(1234, 'en-US');  // "1,234 kcal"
const num = formatNumber(5000, 'vi');            // "5.000"
```

---

## ✅ Zod Schemas with React Hook Form

### Installation & Setup

All necessary packages are already added to `package.json`:
- `zod` - Validation library
- `@hookform/resolvers` - Bridge between React Hook Form and Zod

### Basic Usage Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@schemas/auth.schema';

export const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit((data: LoginFormData) => {
    // data is fully typed and validated!
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input 
        {...register('username')}
        placeholder="Username"
      />
      {errors.username && <span>{errors.username.message}</span>}

      <input 
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 📋 Available Schemas

### Auth Schemas

```typescript
import { 
  loginSchema, type LoginFormData,
  registerSchema, type RegisterFormData,
  forgotPasswordSchema,
  resetPasswordSchema
} from '@schemas/auth.schema';

// Validation rules:
// - Login: username (3-20 chars), password (8-50 chars)
// - Register: all fields + password confirmation + password strength
// - ForgotPassword: email only
// - ResetPassword: password (with strength) + confirmation
```

### Diary Schemas

```typescript
import {
  createFoodEntrySchema, type CreateFoodEntryFormData,
  addFoodModalSchema, type AddFoodModalFormData
} from '@schemas/diary.schema';

// Fields:
// - name: 1-100 chars
// - amount: string like "100g", "1 cup"
// - calories: 0-10000, must be integer
// - mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
// - date: YYYY-MM-DD format (ISO string)
```

### Onboarding Schemas

```typescript
import {
  basicInfoSchema, type BasicInfoFormData,
  goalsSchema, type GoalsFormData,
  onboardingSchema, type OnboardingFormData
} from '@schemas/onboarding.schema';

// Can use schema pieces separately for multi-step forms
// or full schema for single-page onboarding
```

### Profile Schemas

```typescript
import {
  updateProfileSchema, type UpdateProfileFormData,
  changePasswordSchema, type ChangePasswordFormData
} from '@schemas/profile.schema';
```

---

## 🔄 Multi-Step Form Example

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicInfoSchema, goalsSchema } from '@schemas/onboarding.schema';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);

  // Step 1: Basic info
  const form1 = useForm({
    resolver: zodResolver(basicInfoSchema),
  });

  // Step 2: Goals
  const form2 = useForm({
    resolver: zodResolver(goalsSchema),
  });

  const handleStep1 = form1.handleSubmit((data) => {
    localStorage.setItem('basicInfo', JSON.stringify(data));
    setStep(2);
  });

  const handleStep2 = form2.handleSubmit((data) => {
    const basicInfo = JSON.parse(localStorage.getItem('basicInfo') || '{}');
    const complete = { ...basicInfo, ...data };
    // Submit to API
    completeOnboarding(complete);
  });

  return (
    <>
      {step === 1 && <BasicInfoForm onSubmit={handleStep1} form={form1} />}
      {step === 2 && <GoalsForm onSubmit={handleStep2} form={form2} />}
    </>
  );
};
```

---

## 🎨 Better Error Display

```typescript
import { FieldError } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  error?: FieldError;
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => (
  <div className={styles.field}>
    <label>{label}</label>
    <input {...props} className={error ? styles.error : ''} />
    {error && <span className={styles.errorMessage}>{error.message}</span>}
  </div>
);

// Usage:
<InputField 
  label="Username" 
  error={errors.username}
  {...register('username')}
/>
```

---

## ✨ Migration Checklist

When updating existing forms:

- [ ] Add schema import from `src/schemas/`
- [ ] Add `zodResolver` to `useForm` config
- [ ] Update form component prop to include `type LoginFormData` etc.
- [ ] Remove inline validation rules from `register()`
- [ ] Test form validation
- [ ] Replace date formatting calls with `date.ts` utilities

### Before
```typescript
const { register } = useForm({
  mode: 'onBlur'
});

// Validation inline
{...register('username', { 
  required: 'Username required',
  minLength: { value: 3, message: 'Min 3 chars' }
})}

// Date formatting scattered
new Date().toISOString().split('T')[0]
```

### After
```typescript
const { register } = useForm({
  resolver: zodResolver(loginSchema),
  mode: 'onBlur'
});

// Validation in schema
{...register('username')}

// Centralized date formatter
getToday()
```

---

## 🚀 Benefits

✅ **Type-safe**: Full TypeScript inference from Zod schemas
✅ **Centralized**: All validation rules in one place per schema
✅ **Consistent**: Same date formatting across entire app
✅ **Maintainable**: Easy to update validation rules
✅ **Reusable**: Schemas can be composed/extended
✅ **Backend-ready**: Can share same validation logic with server

---

## 📚 References

- [Zod Documentation](https://zod.dev)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#Applyvalidation)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
