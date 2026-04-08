import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';
import { useProfile } from '@hooks/use-onboarding';
import LanguageSwitcher from '@ui/language-switcher';
import styles from './app-layout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { to: '/dashboard', icon: '◈', label: t('nav.dashboard') },
    { to: '/diary', icon: '📓', label: t('nav.diary') },
    { to: '/reports', icon: '📊', label: t('nav.reports') },
    { to: '/profile', icon: '👤', label: t('nav.profile') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goalLabel = profile?.goal === 'lose'
    ? t('onboarding.lose')
    : profile?.goal === 'gain'
      ? t('onboarding.gain')
      : t('onboarding.maintain');

  const initials = user
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : '?';

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🌿</span>
          <span className={styles.brandName}>HealthyTrack</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
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
            {isDark ? `☀ ${t('profile.lightMode')}` : `🌙 ${t('profile.darkMode')}`}
          </button>

          <div className={styles.userRow}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user?.lastName} {user?.firstName}
              </div>
              {profile && (
                <div className={styles.userGoal}>
                  {t('profile.goal')}: {goalLabel}
                </div>
              )}
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            {t('auth.logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>{title}</div>
            <div className={styles.topbarDate}>
              {new Date().toLocaleDateString(
                i18n.language === 'vi' ? 'vi-VN' : 'en-US',
                { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;