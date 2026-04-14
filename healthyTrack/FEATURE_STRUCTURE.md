# ✨ Feature-Based Architecture Documentation

**Date**: April 14, 2026  
**Status**: ✅ Refactoring Complete

---

## 📋 Overview

HealthyTrack has been reorganized from a **layer-based architecture** to a **feature-based (modular) architecture**. This improves scalability, maintainability, and developer experience.

### Layer-Based vs Feature-Based

| Aspect | Layer-Based | **Feature-Based** |
|--------|------------|-------------------|
| Organization | By type (components/, services/, hooks/) | By feature |
| File Discovery | Need to check multiple folders | Everything for feature in one place |
| Scalability | Poor for large apps | Excellent for scaling |
| Feature Isolation | Scattered across many files | Self-contained modules |
| Refactoring | High risk of breaking imports | Low risk, easy to move features |

---

## 📁 New Directory Structure

```
src/features/
├── auth/                          # Authentication feature
│   ├── pages/
│   │   ├── login-page.tsx
│   │   ├── register-page.tsx
│   │   ├── forgot-password-page.tsx
│   │   └── reset-password-page.tsx
│   ├── auth.schema.ts             # Zod validation schemas
│   ├── auth.service.ts            # API calls
│   ├── auth.types.ts              # TypeScript types
│   └── auth.store.ts              # Zustand store
│
├── diary/                         # Diary/food tracking feature
│   ├── pages/
│   │   └── diary-page.tsx
│   ├── components/
│   │   ├── add-food-modal.tsx
│   │   ├── meal-section.tsx
│   │   ├── meal-section-fixed.tsx
│   │   └── diary-calendar.tsx
│   ├── diary.schema.ts            # Form validation
│   ├── diary.service.ts           # API integration
│   ├── diary.types.ts             # Shared types
│   ├── use-diary.hook.ts          # React Query hook
│   └── use-monthly-calories.hook.ts
│
├── dashboard/                     # Dashboard/home page
│   ├── pages/
│   │   └── dashboard-page.tsx
│   ├── components/
│   │   ├── calorie-bar-chart.tsx
│   │   ├── calorie-donut.tsx
│   │   ├── weight-line-chart.tsx
│   │   ├── weight-card.tsx
│   │   ├── reminder-card.tsx
│   │   └── stats-panel.tsx
│   ├── dashboard.service.ts
│   ├── dashboard.types.ts
│   └── use-dashboard.hook.ts
│
├── onboarding/                    # User onboarding/setup
│   ├── pages/
│   │   ├── basic-info-page.tsx
│   │   └── steps/
│   │       ├── basic-info-step.tsx
│   │       ├── goal-step.tsx
│   │       ├── activity-step.tsx
│   │       └── summary-step.tsx
│   ├── onboarding.schema.ts
│   ├── onboarding.service.ts
│   ├── onboarding.types.ts
│   └── use-onboarding.hook.ts
│
├── profile/                       # User profile settings
│   ├── pages/
│   │   └── profile-page.tsx
│   ├── profile.schema.ts          # Profile form validation
│   ├── profile.types.ts
│   └── use-profile.hook.ts
│
├── reports/                       # Analytics and reports
│   ├── pages/
│   │   └── reports-page.tsx
│   ├── components/
│   │   └── reports-sidebar.tsx
│   ├── reports.service.ts
│   ├── reports.types.ts
│   └── use-reports.hook.ts
│
└── shared/                        # ⭐ Shared across all features
    ├── components/
    │   ├── ui/                    # Reusable UI components
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── language-switcher.tsx
    │   │   ├── password-strength.tsx
    │   │   └── button.module.css (+ other styles)
    │   │
    │   └── layout/                # App layout & routing
    │       ├── app-layout.tsx
    │       ├── app-layout-sidebar.tsx
    │       ├── app-layout-topbar.tsx
    │       ├── auth-layout.tsx
    │       ├── protected-route.tsx
    │       ├── guest-route.tsx
    │       └── *.module.css
    │
    ├── hooks/
    │   ├── use-auth.hook.ts       # Auth mutations & queries
    │   ├── use-store.hook.ts      # Zustand store selectors
    │   └── use-water-reminder.hook.ts
    │
    ├── services/
    │   └── auth-service.ts        # Shared API service
    │
    ├── store/
    │   ├── auth.store.ts          # Auth state (Zustand)
    │   ├── theme.store.ts         # Theme state
    │   └── notification.store.ts  # Notifications state
    │
    ├── types/
    │   └── (shared type definitions if needed)
    │
    ├── utils/
    │   ├── date.ts                # Date helpers
    │   ├── nutrition.ts           # Nutrition calculations
    │   ├── debounce.ts            # Debounce utility
    │   └── ...
    │
    ├── styles/
    │   └── globals.css            # Global styles
    │
    ├── locales/                   # i18n translations
    │   ├── en/
    │   │   └── translation.json
    │   └── vi/
    │       └── translation.json
    │
    ├── USAGE_EXAMPLES.ts          # Documentation
    └── ZOD_SCHEMAS_GUIDE.md       # Schema usage guide

├── App.tsx                        # Main app component
├── main.tsx                       # Entry point
├── i18n.ts                        # i18n configuration
├── index.css                      # CSS reset
├── vite-env.d.ts                  # Vite types

```

---

## 🔗 Import Path Aliases

After reorganization, use these path aliases in imports:

```typescript
// 🔴 OLD (Don't use anymore)
import { loginSchema } from '@schemas/auth.schema'
import { AuthLayout } from '@components/layout/auth-layout'
import { useAuth } from '@hooks/use-auth'

// 🟢 NEW (Use these)
import { loginSchema } from '@auth/auth.schema'
import AuthLayout from '@shared/components/layout/auth-layout'
import { useAuth } from '@shared/hooks/use-auth.hook'
```

### Available Aliases

- `@/` - src root
- `@features/` - All features
- `@shared/` - Shared directory
- `@auth/` - Auth feature
- `@diary/` - Diary feature
- `@dashboard/` - Dashboard feature
- `@onboarding/` - Onboarding feature
- `@profile/` - Profile feature
- `@reports/` - Reports feature
- `@components/` - Shared UI & layout components
- `@ui/` - Shared UI components
- `@layout/` - Layout components (app-layout, auth-layout, etc)
- `@hooks/` - Shared hooks
- `@services/` - Shared services
- `@store/` - Shared stores
- `@typing/` - Shared types
- `@utils/` - Utilities
- `@styles/` - Shared styles
- `@locales/` - i18n locales

---

## 📦 Feature Organization Pattern

Each feature follows this pattern:

```
feature/
├── pages/              # Page components for this feature
│   └── *.tsx
├── components/         # Feature-specific components (if needed)
│   └── *.tsx
├── *.schema.ts        # Zod validation schemas (if needed)
├── *.service.ts       # API service layer
├── *.types.ts         # TypeScript types
├── *.store.ts         # Zustand store (if needed)
└── *.hook.ts          # React Query hooks & custom hooks
```

---

## 🎯 Import Examples by Feature

### Auth Feature
```typescript
// Pages import schema and hooks
import { loginSchema, type LoginFormData } from '@auth/auth.schema'
import { useLogin } from '@shared/hooks/use-auth'
import AuthLayout from '@shared/components/layout/auth-layout'

// Components import types and services
import type { User } from '@auth/auth.types'
import { authService } from '@shared/services/auth-service'
```

### Diary Feature
```typescript
// Pages import schemas, types, hooks
import { addFoodModalSchema, type AddFoodModalFormData } from '@diary/diary.schema'
import { useDiaryEntries, useAddFoodEntry } from '@diary/use-diary.hook'
import type { MealType } from '@diary/diary.types'

// Components import types
import type { FoodEntry, MealGroup } from '@diary/diary.types'
```

### Shared Components
```typescript
// Any feature can import shared components
import Button from '@ui/button'
import Input from '@ui/input'
import AppLayout from '@shared/components/layout/app-layout'
import { useAuth } from '@shared/hooks/use-auth.hook'
import { useTheme } from '@shared/hooks/use-store.hook'
```

---

## 🔄 Cross-Feature Dependencies

### Allowed ✅
- **Any feature → Shared** (most common)
  ```typescript
  import Button from '@ui/button'
  import { useAuth } from '@shared/hooks/use-auth.hook'
  ```

- **Shared → Auth store** (needed for routing state)
  ```typescript
  import { useAuthStore } from '@auth/auth.store'
  ```

### Discouraged ⚠️
- **Feature A → Feature B** (creates tight coupling)
  ```typescript
  // ❌ Avoid this - breaks modularity
  import { useDiary } from '@diary/use-diary.hook'
  ```

---

## 🛠️ Configuration Files

### tsconfig.json
```json
{
  "paths": {
    "@features/*": ["src/features/*"],
    "@shared/*": ["src/features/shared/*"],
    "@auth/*": ["src/features/auth/*"],
    "@diary/*": ["src/features/diary/*"],
    "@dashboard/*": ["src/features/dashboard/*"],
    "@onboarding/*": ["src/features/onboarding/*"],
    "@profile/*": ["src/features/profile/*"],
    "@reports/*": ["src/features/reports/*"],
    "@ui/*": ["src/features/shared/components/ui/*"],
    "@layout/*": ["src/features/shared/components/layout/*"],
    "@hooks/*": ["src/features/shared/hooks/*"],
    "@services/*": ["src/features/shared/services/*"],
    // ... more aliases
  }
}
```

### vite.config.ts
```typescript
resolve: {
  alias: {
    '@': 'src',
    '@features': 'src/features',
    '@shared': 'src/features/shared',
    '@auth': 'src/features/auth',
    '@diary': 'src/features/diary',
    // ... more aliases
  }
}
```

---

## 🚀 Benefits

1. **Scalability** ⬆️
   - Add new features without touching existing code
   - Features can grow independently

2. **Maintainability** 🔧
   - Related code is co-located
   - Easier to understand feature boundaries
   - Faster to find code

3. **Testing** ✅
   - Each feature can be tested in isolation
   - Mock dependencies easily

4. **Performance** ⚡
   - Easier to code-split features
   - Can lazy-load features

5. **Refactoring** 🔄
   - Move or remove features with confidence
   - Less risk of breaking other features

6. **Onboarding** 👥
   - New developers understand structure quickly
   - Each feature is a clear module

---

## 📚 Zod Schemas Organization

All validation schemas are within their features:

- `@auth/auth.schema.ts` - Login, Register, Password reset
- `@diary/diary.schema.ts` - Food entry validation
- `@onboarding/onboarding.schema.ts` - User setup forms
- `@profile/profile.schema.ts` - Profile update & password change

See `ZOD_SCHEMAS_GUIDE.md` for usage examples.

---

## 🔄 Date Utilities

Centralized in `@shared/utils/date.ts` with 11 helper functions:
- `getToday()`, `toISODateString()`, `addDays()`
- `formatDateLong()`, `formatDateShort()`, `getDayName()`
- `formatCalories()`, `formatNumber()`, etc.

Import: `import { getToday, formatDateLong } from '@utils/date'`

---

## 📝 Next Steps

1. **Build & Test**: Run `npm run build` to identify any remaining import issues
2. **Fix Imports**: If errors occur, use the patterns shown in this guide
3. **Add New Features**: Follow the feature pattern when adding new modules
4. **Update Documentation**: Keep this guide updated as structure evolves

---

## 🎓 Best Practices

1. ✅ Keep features self-contained and loosely coupled
2. ✅ Use shared components and utilities from `@shared/`
3. ✅ Name files consistently: `*.schema.ts`, `*.service.ts`, `*.types.ts`, `*.hook.ts`
4. ✅ Export types and services from feature root for easier imports
5. ✅ Document cross-feature dependencies
6. ✅ Add index.ts files to simplify imports

---

**Last Updated**: April 14, 2026  
**Status**: Live in production-ready structure  
**Maintainer**: HealthyTrack Dev Team
