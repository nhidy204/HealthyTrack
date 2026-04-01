import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/language-switcher';
import styles from './auth-layout.module.css';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.root}>
            {/* Language switcher */}
            <div className={styles.headerRight}>
                <LanguageSwitcher />
            </div>

            {/* Left decorative panel */}
            <aside className={styles.left}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}>🌿</div>
                    <span className={styles.brandName}>HealthyTrack</span>
                </div>

                <h2 className={styles.headline}>
                    {t('auth.headline')}
                </h2>
                <p className={styles.tagline}>
                    {t('auth.tagline')}
                </p>

                <div className={styles.stats}>
                    {[
                        { num: '10k+', label: t('auth.users') },
                        { num: '98%', label: t('auth.satisfied') },
                        { num: '4.9★', label: t('auth.rating') },
                    ].map((s) => (
                        <div key={s.label} className={styles.statBox}>
                            <div className={styles.statNum}>{s.num}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Right: form area */}
            <main className={styles.right}>{children}</main>
        </div>
    );
};

export default AuthLayout;
