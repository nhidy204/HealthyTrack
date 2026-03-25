import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { useThemeStore } from '../../store/theme-store';
import { useProfile } from '../../hooks/use-onboarding';
import styles from './app-layout.module.css';

const NAV_ITEMS = [ 
    { to: '/dashboard', icon: '◈', label: 'Tổng quan' },
    { to: '/diary', icon: '📓', label: 'Nhật ký ăn' },
    { to: '/reports', icon: '📊', label: 'Báo cáo' },
    { to: '/profile', icon: '👤', label: 'Hồ sơ' },
];

interface AppLayoutProps {
    children: React.ReactNode; //prop -> toàn bộ nội dung nằm giữa thẻ mở <AppLayout> và <AL />
    title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
    //lấy dữ liệu từ stotre
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { data: profile } = useProfile();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); //xóa cả token + user
        navigate('/login');
    };

    const goalLabel = profile?.goal === 'lose' ? 'Giảm cân'
        : profile?.goal === 'gain' ? 'Tăng cân' : 'Duy trì';

    const initials = user
        ? (user.firstName[0] + user.lastName[0]).toUpperCase()
        : '?';

    return (
        <div className={styles.root}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span className={styles.brandIcon}>🌿</span>
                    <span className={styles.brandName}>HealthyTrack</span>
                </div>

                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <NavLink //navlink tự động cung cấp biến 'isActive = true" nếu user đang ở trang đó
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => 
                                `${styles.navItem} ${isActive ? styles.navActive : ''}`
                            }
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.sidebarBottom}>
                    <button className={styles.themeBtn} onClick={toggleTheme}>
                        {isDark ? '☀ Sáng' : '🌙 Tối'}
                    </button>
                    <div className={styles.userRow}>
                        <div className={styles.avatar}>{initials}</div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>
                                {user?.lastName} {user?.firstName}
                            </div>
                            {profile && (
                                <div className={styles.userGoal}>Mục tiêu: {goalLabel}</div>
                            )}
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className={styles.main}>
                {/* Topbar */}
                <header className={styles.topbar}>
                    <div>
                        <div className={styles.topbarTitle}>{title}</div>
                        <div className={styles.topbarDate}>
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </div>
                    </div>
                </header>

                {/* toàn bộ nd của trang sẽ nhét vô đây */}
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default AppLayout;
