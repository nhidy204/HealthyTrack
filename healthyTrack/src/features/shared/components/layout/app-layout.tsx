import React, { useState, useCallback, useEffect } from 'react';
import { useThemeStore } from '@shared/store/theme.store';
import { AppLayoutSidebar } from './app-layout-sidebar';
import { AppLayoutTopbar } from './app-layout-topbar';
import styles from './app-layout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
  }, [isDark]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.root}>
      <AppLayoutSidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {sidebarOpen && (
        <div className={styles.overlay} onClick={handleSidebarClose} />
      )}

      <div className={styles.main}>
        <AppLayoutTopbar
          title={title}
          onMenuToggle={handleSidebarToggle}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

AppLayout.displayName = 'AppLayout';
export default AppLayout;
