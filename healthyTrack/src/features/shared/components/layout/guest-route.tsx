import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@auth/auth.store';
import { useProfile } from '@shared/hooks/use-onboarding';

//ktra t.thái đnhap
const GuestRoute: React.FC = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated); //lấy biến isAuthenticated (true/false) xem người dùng đã đăng nhập hay chưa 
    const { data: profile, isLoading } = useProfile();

    if (!isAuthenticated) return <Outlet />;
    if (isLoading) return null; //đã đn rồi nhưng profile dg tải --> màn trắng loading chờ 

    return <Navigate to={profile ? '/dashboard' : '/onboarding'} replace />; //replace = true: ghi đè lịch sử trình duyệt 
};

export default GuestRoute;


