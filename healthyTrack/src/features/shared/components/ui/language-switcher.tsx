import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './language-switcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  return (
    <button className={styles.btn} onClick={toggle}>
      {i18n.language === 'vi' ? '🇬🇧 EN' : '🇻🇳 VI'}
    </button>
  );
};

export default LanguageSwitcher;
