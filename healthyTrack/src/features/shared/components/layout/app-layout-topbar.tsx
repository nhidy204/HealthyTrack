import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@ui/language-switcher';
import styles from './app-layout.module.css';

interface AppLayoutTopbarProps {
  title: string;
  onMenuToggle: () => void;
}

export const AppLayoutTopbar: React.FC<AppLayoutTopbarProps> = ({
  title,
  onMenuToggle,
}) => {
  const { i18n } = useTranslation();

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(
      i18n.language === 'vi' ? 'vi-VN' : 'en-US',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );
  }, [i18n.language]);

  return (
    <header className={styles.topbar}>
      <button
        className={styles.hamburger}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div>
        <div className={styles.topbarTitle}>{title}</div>
        <div className={styles.topbarDate}>{formattedDate}</div>
      </div>
      <LanguageSwitcher />
    </header>
  );
};

AppLayoutTopbar.displayName = 'AppLayoutTopbar';

