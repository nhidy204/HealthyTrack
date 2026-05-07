import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@auth/auth.store';
import { useProfile } from '@shared/hooks/use-onboarding.hook';

//ktra t.thái đnhap
const GuestRoute: React.FC = () => {
    const location = useLocation();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated); //lấy biến isAuthenticated (true/false) xem người dùng đã đăng nhập hay chưa 
    
    // Only check profile if NOT on onboarding page (to avoid circular logic + 404 spam)
    const shouldCheckProfile = isAuthenticated && location.pathname !== '/onboarding';
    const { data: profile, isLoading, isError } = useProfile(!shouldCheckProfile);

    if (!isAuthenticated) return <Outlet />;
    
    // If on onboarding page, allow access without profile check
    if (location.pathname === '/onboarding') return <Outlet />;
    
    // While loading profile, show nothing (don't redirect yet)
    if (isLoading) return null;
    
    // If error loading profile OR no profile exists → go to onboarding
    if (isError || !profile) {
        return <Navigate to="/onboarding" replace />;
    }
    
    // Profile exists → go to dashboard
    return <Navigate to="/dashboard" replace />;
};

export default GuestRoute;




