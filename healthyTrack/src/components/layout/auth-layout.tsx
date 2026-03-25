import React from 'react';
import styles from './auth-layout.module.css';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className={styles.root}>
            {/* Left decorative panel */}
            <aside className={styles.left}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}>🌿</div>
                    <span className={styles.brandName}>HealthyTrack</span>
                </div>

                <h2 className={styles.headline}>
                    Sức khỏe tốt hơn<br />mỗi ngày
                </h2>
                <p className={styles.tagline}>
                    Theo dõi calo, cân nặng và thói quen sinh hoạt
                    để đạt mục tiêu sức khỏe của bạn.
                </p>

                <div className={styles.stats}>
                    {[
                        { num: '10k+', label: 'Người dùng' },
                        { num: '98%', label: 'Hài lòng' },
                        { num: '4.9★', label: 'Đánh giá' },
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
