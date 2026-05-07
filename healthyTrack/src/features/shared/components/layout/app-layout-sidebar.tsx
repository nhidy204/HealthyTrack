import React, { useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useTheme } from '@shared/hooks/use-store.hook';
import styles from './app-layout.module.css';

interface AppLayoutSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NavItems: React.FC<{ onItemClick: () => void }> = ({ onItemClick }) => {
  const { t } = useTranslation();

  const navItems = useMemo(
    () => [
      { to: '/dashboard', icon: '◈', label: t('nav.dashboard') },
      { to: '/diary', icon: '📓', label: t('nav.diary') },
      { to: '/reports', icon: '📊', label: t('nav.reports') },
      { to: '/profile', icon: '👤', label: t('nav.profile') },
    ],
    [t]
  );

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navActive : ''}`
          }
          onClick={onItemClick}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

NavItems.displayName = 'NavItems';

const UserSection: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = useCallback(() => {
    logout();
    onClose();
  }, [logout, onClose]);

  const initials = useMemo(() => {
    if (!user) return '?';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  }, [user]);

  return (
    <div className={styles.sidebarBottom}>
      <button
        className={styles.themeBtn}
        onClick={toggleTheme}
        type="button"
      >
        {isDark
          ? `☀ ${t('profile.lightMode')}`
          : `🌙 ${t('profile.darkMode')}`}
      </button>

      <div className={styles.userRow}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {user?.lastName} {user?.firstName}
          </div>
        </div>
      </div>

      <button
        className={styles.logoutBtn}
        onClick={handleLogout}
        type="button"
      >
        {t('auth.logout')}
      </button>
    </div>
  );
};

UserSection.displayName = 'UserSection';

export const AppLayoutSidebar: React.FC<AppLayoutSidebarProps> = ({
  open,
  onClose,
}) => {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🌿</span>
        <span className={styles.brandName}>HealthyTrack</span>
      </div>

      <NavItems onItemClick={onClose} />
      <UserSection onClose={onClose} />
    </aside>
  );
};

AppLayoutSidebar.displayName = 'AppLayoutSidebar';



