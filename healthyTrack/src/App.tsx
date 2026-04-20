import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from '@shared/components/layout/protected-route';
import GuestRoute from '@shared/components/layout/guest-route';
import { useThemeStore } from '@shared/store/theme.store';
import '@/index.css';

//lazy-loaded pages
const LoginPage = lazy(() => import('@pages/auth/login-page'));
const RegisterPage = lazy(() => import('@pages/auth/register-page'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/forgot-password-page'));
const ResetPasswordPage = lazy(() => import('@pages/auth/reset-password-page'));

//placeholder pages 
const OnboardingPage = lazy(() => import('@pages/onboarding/basic-info-page'));
const DashboardPage = lazy(() => import('@pages/dashboard/dashboard-page'));
const DiaryPage = lazy(() => import('@pages/diary/diary-page'));
const ReportsPage = lazy(() => import('@pages/reports/reports-page'));
const ProfilePage = lazy(() => import('@pages/profile/profile-page'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const Fallback = () => (
  <div className="fallback">
    <span className="fallbackText">Đang tải...</span>
  </div>
);

const App: React.FC = () => {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/*để mặc định vào login khi mới vào trang*/}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Guest-only routes (redirect to /dashboard if already logged in) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/*protected routes để tránh user ko login mà muốn vào*/}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
