# HealthyTrack Code Conventions

## 🎯 Overview
This document defines unified code patterns for HealthyTrack to ensure consistency, maintainability, and performance.

---

## 📦 Component Declaration

### ✅ Standard Pattern
All functional components MUST use this pattern:

```typescript
// 1. Imports
import React, { useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './my-component.module.css';

// 2. Type declarations (interfaces at top)
interface MyComponentProps {
  title: string;
  children: ReactNode;
  onSubmit: (data: FormData) => void;
}

// 3. Component definition (standard FC)
const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  children, 
  onSubmit 
}) => {
  // ... implementation

  return <div className={styles.root}>...</div>;
};

// 4. Export with display name
MyComponent.displayName = 'MyComponent';
export default MyComponent;
```

### ❌ Incorrect Patterns (Avoid)
```typescript
// ❌ Arrow function with defaults
export const MyComponent = ({ title }: MyComponentProps) => {};

// ❌ Named export without React.FC type
export function MyComponent() {}

// ❌ Type instead of interface for props
type MyComponentProps = {}; // Use interface instead
```

---

## 📝 Props Type Declaration

### ✅ Use `interface` for component props:
```typescript
interface MyComponentProps {
  title: string;
  count?: number;
  onSubmit: (data: FormData) => void;
}
```

### ❌ Avoid `type` for props:
```typescript
type MyComponentProps = {} // Don't use type for props
```

---

## 🪝 Hooks & Memoization

### ✅ Always Use Memoization for:

#### 1. **Functions passed as props** (use `useCallback`)
```typescript
const handleSubmit = useCallback((data: FormData) => {
  mutate(data);
}, [mutate]); // Include dependencies!

<MealSection 
  onAdd={handleSubmit}
  onDelete={useCallback((id) => deleteEntry(id), [deleteEntry])}
/>
```

#### 2. **Objects/Arrays in render** (use `useMemo`)
```typescript
const NAV_ITEMS = useMemo(() => [
  { to: '/dashboard', icon: '◈', label: t('nav.dashboard') },
  { to: '/diary', icon: '📓', label: t('nav.diary') },
], [t]);

const filterOptions = useMemo(
  () => ({ status: 'active', limit: 10 }),
  []
);
```

#### 3. **Expensive computations** (use `useMemo`)
```typescript
const totalStats = useMemo(() => {
  return meals.reduce((acc, meal) => {
    return { ...acc, calories: acc.calories + meal.calories };
  }, { calories: 0 });
}, [meals]);
```

### ✅ Zustand Store with Selectors (CRITICAL!)
**ALWAYS use selectors to avoid whole-store re-renders:**

```typescript
// ✅ GOOD - Selector pattern (minimal re-renders)
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);

// ❌ BAD - Destructuring entire store (unnecessary re-renders)
const { user, logout } = useAuthStore();
```

**For multiple values from store, create a hook:**
```typescript
// src/hooks/use-auth-store.ts
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  return { user, isLoading, logout };
};

// Usage in component
const { user, logout } = useAuth();
```

---

## 🧩 Presentational Components

### ✅ Memoize Pure Components:
```typescript
interface CardProps {
  title: string;
  value: number;
  icon: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div>
      <span>{icon}</span>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
};

Card.displayName = 'Card';
export default React.memo(Card);
```

### ✅ When NOT to memo:
- Components that re-render for valid reasons (state changes, parent re-render with new data)
- Small/light components

---

## 🛠️ Utility Functions

### ✅ Standard Pattern:
```typescript
// src/utils/nutrition.ts (or domain-specific folder)

/** Calculate BMR using Mifflin-St Jeor equation */
export const calcBMR = (params: BasicInfo): number => {
  const base = 10 * params.weight + 6.25 * params.height - 5 * params.age;
  return params.gender === 'male' ? base + 5 : base - 161;
};

/** Calculate TDEE multiplier */
export const calcTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  return bmr * activityLevel;
};

/** Calculate target calories based on goal */
export const calcTargetCalories = (tdee: number, goal: Goal): number => {
  const adjustments: Record<Goal, number> = {
    lose: -400,
    gain: 400,
    maintain: 0,
  };
  return tdee + adjustments[goal];
};
```

### ✅ Naming Conventions:
- **Query functions**: `get*()`, `fetch*()`
  ```typescript
  export const getMealsByDate = async (date: Date) => { }
  export const fetchUserProfile = async (userId: string) => { }
  ```
- **Calculation functions**: `calc*()`, `compute*()`
  ```typescript
  export const calcBMI = (weight: number, height: number) => { }
  export const computeStats = (entries: Entry[]) => { }
  ```
- **Transform functions**: `format*()`, `parse*()`, `transform*()`
  ```typescript
  export const formatDate = (date: Date) => { }
  export const parseNutrition = (data: unknown) => { }
  export const transformMeals = (meals: Meal[]) => { }
  ```
- **Predicate functions**: `is*()`, `can*()`
  ```typescript
  export const isValidEmail = (email: string) => { }
  export const canDeleteEntry = (entry: Entry, user: User) => { }
  ```

### ❌ Anti-patterns:
```typescript
// ✗ Generic names
export const fn1 = () => {}
export const process = () => {}

// ✗ Methods-like naming
export const bmr = { calc: () => {} }

// ✗ Mixing patterns
export function getCalories() { }  // Use arrow functions
const formatDate = (date) => { }   // No export
```

---

## 🎨 Styling Conventions

### ✅ Always Use CSS Modules:
```tsx
import styles from './my-component.module.css';

const MyComponent: React.FC<Props> = (props) => (
  <div className={styles.root}>
    <p className={styles.title}>{title}</p>
  </div>
);
```

### ❌ Avoid:
- Inline styles (`style={{}}`)
- Global class names in components
- Tailwind classes mixed with modules

---

## 🔄 State Management

### ✅ Zustand Store Pattern:
```typescript
// src/store/my-store.ts
import { create } from 'zustand';

interface MyStore {
  // State
  count: number;
  isLoading: boolean;
  
  // Actions
  increment: () => void;
  decrement: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  isLoading: false,
  
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

### ✅ Usage with Selectors (Always!):
```typescript
// Use selector for specific state slice
const count = useMyStore((state) => state.count);
const increment = useMyStore((state) => state.increment);
```

### React Query (Server State):
- Use for server data fetching
- Configure proper `staleTime` and `gcTime`
- Leverage `queryKey` factory for consistency

---

## 📋 Type Declarations

### ✅ Pattern:
```typescript
// src/types/diary-types.ts

/** User meal entry */
export interface MealEntry {
  id: string;
  userId: string;
  mealType: MealType;
  date: Date;
  foods: FoodItem[];
  totalCalories: number;
  createdAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}
```

### ✅ Guidelines:
- Use `interface` for objects with properties
- Use `type` for unions and literal types
- Document complex types with JSDoc comments
- Keep types close to their usage (same file or dedicated types folder)

---

## 🚀 Performance Checklist

- [ ] React Compiler enabled (automatic memoization)
- [ ] All callbacks passed to children wrapped with `useCallback`
- [ ] All objects/arrays in render wrapped with `useMemo`
- [ ] Zustand selectors used everywhere (no store destructuring)
- [ ] Presentational components memoized with `React.memo`
- [ ] Components have `displayName` for debugging
- [ ] Unused props/variables removed (ESLint enforces)
- [ ] `useEffect` dependencies correct (ESLint warns)
- [ ] No inline style objects
- [ ] No inline function definitions in JSX

---

## 📚 File Structure Convention

```
src/
├── components/          # UI components
│   ├── layout/         # Layout wrapper components
│   ├── charts/         # Chart components
│   ├── diary/          # Diary feature components
│   ├── reports/        # Report feature components
│   └── ui/             # Reusable UI primitives
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── services/           # API & external services
├── store/              # Zustand stores
├── types/              # TypeScript types & interfaces
├── utils/              # Utility functions
├── locales/            # i18n translations
└── styles/             # Global styles
```

---

## ✅ Code Review Checklist

Before committing, ensure:

1. **Components**
   - [ ] Typed with `React.FC<Props>`
   - [ ] Has `displayName`
   - [ ] Props use `interface`
   - [ ] All callbacks use `useCallback`
   - [ ] All objects/arrays use `useMemo`

2. **Zustand Usage**
   - [ ] Using selectors (no destructuring)
   - [ ] Store has clear state/actions separation

3. **Utilities**
   - [ ] Named consistently (get*, calc*, format*, etc.)
   - [ ] Exported as arrow functions
   - [ ] Have JSDoc comments for complex logic

4. **Types**
   - [ ] Interface for object shapes
   - [ ] Type for unions/literals
   - [ ] Documented with /** comments

5. **Performance**
   - [ ] ESLint warnings cleared
   - [ ] No unused variables/parameters
   - [ ] useEffect dependencies correct

---

## 🔧 Exceptions & When to Break Rules

- **React.memo:** Skip for components that frequently receive new props legitimately
- **useCallback:** Can be skipped for performance-uncritical callbacks
- **useMemo:** Only for expensive computations (not every object/array)
- **TypeScript**: Can use `as unknown as Type` for type migrations (with comment)

---

## 📖 References

- [React Compiler Docs](https://react.dev/learn/react-compiler)
- [Zustand Best Practices](https://zustand.docs.pmnd.rs/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
