# Zod Schemas & Consolidated Date Utilities - Summary

## 🎯 What Was Done

### Problem Statement
- ❌ Date formatting scattered across components (mỗi chỗ lại có 1 dạng format riêng)
- ❌ Form validation rules duplicated in React Hook Form config
- ❌ No centralized validation schemas
- ❌ Hard to maintain consistent validation across app

### Solution
- ✅ **Centralized Date Utilities** - All date formatting in one place (`src/utils/date.ts`)
- ✅ **Zod Schemas** - Type-safe validation schemas for all forms
- ✅ **React Hook Form Integration** - Using `@hookform/resolvers/zod`
- ✅ **Complete Documentation** - Guides and examples for migration

---

## 📁 Files Created

### 1. Date Utilities (`src/utils/date.ts`)
```
Functions:
- getToday() → "2026-04-13"
- toISODateString(date) → "2026-04-13"
- addDays(date, n) → Date object
- formatDateLong(date, locale) → "Sunday, 13 April 2026"
- formatDateShort(date, locale) → "Sun, 13 Apr"
- getDayName(isoDate, locale) → "Sunday" or "Chủ nhật"
- formatCalories(calories, locale) → "1,234 kcal"
- formatNumber(num, locale) → "1,234"
- isToday(date) → boolean
- parseISODate(isoDate) → Date
```

**Before**: Date formatting scattered everywhere
```typescript
new Date().toISOString().split('T')[0]
new Date(date).toLocaleDateString(...)
new Date().getDay()
```

**After**: Centralized and consistent
```typescript
getToday()
formatDateLong(date, locale)
getDayName(isoDate, locale)
```

### 2. Validation Schemas

#### Auth Schema (`src/schemas/auth.schema.ts`)
- `loginSchema` - Username/Password validation
- `registerSchema` - Full registration with confirm password
- `forgotPasswordSchema` - Email only
- `resetPasswordSchema` - New password with confirmation

#### Diary Schema (`src/schemas/diary.schema.ts`)
- `createFoodEntrySchema` - Food name, amount, calories, meal type, date
- `addFoodModalSchema` - Without date (handled by parent)

#### Onboarding Schema (`src/schemas/onboarding.schema.ts`)
- `basicInfoSchema` - Gender, age, height, weight
- `goalsSchema` - Goal type and activity level
- `onboardingSchema` - Combined full form

#### Profile Schema (`src/schemas/profile.schema.ts`)
- `updateProfileSchema` - All user profile fields with validation
- `changePasswordSchema` - Current + new password with confirmation

### 3. Documentation

#### `ZOD_SCHEMAS_GUIDE.md`
Complete guide with:
- Overview of all available schemas
- Import patterns
- Usage examples
- Multi-step form patterns
- Error display patterns
- Migration checklist

#### `src/schemas/USAGE_EXAMPLES.ts`
Practical code examples showing:
- Before/After patterns
- Reusable InputField component
- Multi-step onboarding
- Date utilities in components
- Tips and common mistakes

---

## 🎯 Benefits

### For Maintainability
✅ All date formatting in one file → Easy to update
✅ All validation in one schema per form → No duplication
✅ Change validation rule in one place → Changes everywhere
✅ TypeScript inference → Fully typed form data

### For Consistency
✅ Same date format across app
✅ Same validation rules everywhere
✅ Same error messages
✅ Standardized form patterns

### For Developer Experience
✅ Less boilerplate code
✅ IDE autocomplete for form data
✅ Clear error messages
✅ Reusable patterns

### For Users
✅ Consistent validation messages
✅ Better form feedback
✅ Correct date formatting per locale
✅ Consistent number formatting

---

## 🚀 Quick Start

### 1. Use Date Utils
```typescript
import { getToday, formatDateLong, formatCalories } from '@utils/date';

const today = getToday();  // "2026-04-13"
const display = formatDateLong(new Date());  // "Sunday, 13 April 2026"
const cal = formatCalories(1234);  // "1,234 kcal"
```

### 2. Use Zod Schemas in Forms
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@schemas/auth.schema';

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}
    </form>
  );
};
```

---

## 📦 Dependencies Added

```json
{
  "zod": "^3.23.8",
  "@hookform/resolvers": "^3.4.2"
}
```

---

## 🔄 Migration Path

### Priority 1 (High Impact)
- [ ] Auth pages (login, register, reset password)
- [ ] Diary page (add food modal)
- [ ] Profile page (update profile form)

### Priority 2 (Medium Impact)
- [ ] Onboarding pages
- [ ] Other forms using React Hook Form

### Priority 3 (Low Impact)
- [ ] Components using scattered date utils
- [ ] Replace all inline date formatting

---

## 📚 Reference Files

| File | Purpose |
|------|---------|
| `src/utils/date.ts` | All date utilities |
| `src/schemas/auth.schema.ts` | Auth validation schemas |
| `src/schemas/diary.schema.ts` | Diary validation schemas |
| `src/schemas/onboarding.schema.ts` | Onboarding validation schemas |
| `src/schemas/profile.schema.ts` | Profile validation schemas |
| `src/schemas/USAGE_EXAMPLES.ts` | Before/After examples |
| `ZOD_SCHEMAS_GUIDE.md` | Complete guide |

---

## ✅ Next Steps

1. ✅ Install dependencies - `npm install`
2. 📋 Review `ZOD_SCHEMAS_GUIDE.md` for complete guide
3. 👀 Check `src/schemas/USAGE_EXAMPLES.ts` for code examples
4. 🔄 Start migrating forms following the patterns
5. ✨ Replace date formatting calls with utilities from `src/utils/date.ts`
6. 🧪 Test all forms after migration
7. 🎉 Enjoy consistent, maintainable code!

---

## 💡 Pro Tips

### Share Schemas with Backend
If using Node.js/Express backend, you can use same Zod schemas:
```typescript
// Backend
import { loginSchema } from '@shared/schemas';

app.post('/login', (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  // Process login...
});
```

### Compose Schemas
```typescript
// Reuse parts of schemas
const updateProfileWithPasswordSchema = updateProfileSchema.extend({
  password: changePasswordSchema.shape.newPassword,
});
```

### Custom Error Messages
```typescript
const schema = z.object({
  email: z.string().email('Your custom error message'),
});
```

---

**Ready to use! Check `ZOD_SCHEMAS_GUIDE.md` for detailed instructions.**
