import React from 'react';
import AppLayout from '../../components/layout/app-layout';
import CalorieDonut from '../../components/charts/calorie-donut';
import WeightCard from '../../components/charts/weight-card';
import ReminderCard from '../../components/charts/reminder-card';
import { useDailySummary } from '../../hooks/use-dashboard';
import { useProfile } from '../../hooks/use-onboarding';
import { useAuthStore } from '../../store/auth-store';
import { Link } from 'react-router-dom';
import styles from './dashboard-page.module.css';

const DashboardPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const { data: profile } = useProfile();
    const today = new Date().toISOString().split('T')[0];
    const { data: summary, isLoading } = useDailySummary(today);

    const target = summary?.targetCalories ?? profile?.targetCalories ?? 0;
    const consumed = summary?.totalCalories ?? 0;
    const remaining = Math.max(0, target - consumed);

    return (
        <AppLayout title={`Xin chào, ${user?.firstName ?? ''} 👋`}>
            <div className={styles.summaryRow}>
                {[
                    { label: 'Mục tiêu', val: target.toLocaleString(), unit: 'kcal / ngày', accent: false },
                    { label: 'Đã nạp', val: consumed.toLocaleString(), unit: 'kcal hôm nay', accent: true },
                    { label: 'Còn lại', val: remaining.toLocaleString(), unit: 'kcal', accent: false },
                    { label: 'Cân nặng', val: summary?.weight?.toFixed(1) ?? '—', unit: 'kg hôm nay', accent: false },
                ].map((m) => (
                    <div key={m.label} className={`${styles.metricCard} ${m.accent ? styles.accent : ''}`}>
                        <div className={styles.metricLabel}>{m.label}</div>
                        <div className={styles.metricVal}>{isLoading ? '...' : m.val}</div>
                        <div className={styles.metricUnit}>{m.unit}</div>
                    </div>
                ))}
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Calo hôm nay</div>
                    <CalorieDonut consumed={consumed} target={target} />
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>Nhật ký ăn uống hôm nay</div>
                        <Link to="/diary" className={styles.cardLink}>Xem tất cả →</Link>
                    </div>
                    {consumed === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Chưa có bữa ăn nào hôm nay.</p>
                            <Link to="/diary" className={styles.addMealLink}>+ Thêm bữa ăn</Link>
                        </div>
                    ) : (
                        <div className={styles.diaryTotal}>
                            <span className={styles.diaryTotalLabel}>Tổng</span>
                            <span className={styles.diaryTotalVal}>{consumed.toLocaleString()} kcal</span>
                        </div>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Nhắc nhở hôm nay</div>
                    <ReminderCard exerciseMinutes={summary ? 30 : 0} />
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Cập nhật cân nặng</div>
                    <WeightCard />
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;
