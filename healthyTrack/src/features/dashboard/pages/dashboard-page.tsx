import React from 'react';
import AppLayout from '@shared/components/layout/app-layout';
import CalorieDonut from '@dashboard/components/calorie-donut';
import WeightCard from '@dashboard/components/weight-card';
import ReminderCard from '@dashboard/components/reminder-card';
import { useDailySummary } from '@shared/hooks/use-dashboard';
import { useProfile } from '@shared/hooks/use-onboarding';
import { useAuthStore } from '@auth/auth.store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './dashboard-page.module.css';

const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const user = useAuthStore((s) => s.user); //zustand
    const { data: profile } = useProfile();
    const today = new Date().toISOString().split('T')[0];
    const { data: summary, isLoading } = useDailySummary(today);

    const target = summary?.targetCalories ?? profile?.targetCalories ?? 0;
    const consumed = summary?.totalCalories ?? 0;
    const remaining = Math.max(0, target - consumed);

    return (
        <AppLayout title={t('dashboard.hello', { name: user?.firstName ?? '' })}>
            <div className={styles.summaryRow}>
                {[
                    { label: t('dashboard.target'), val: target.toLocaleString(), unit: t('dashboard.kcalPerDay'), accent: false },
                    { label: t('dashboard.consumed'), val: consumed.toLocaleString(), unit: t('dashboard.calorieToday'), accent: true },
                    { label: t('dashboard.remaining'), val: remaining.toLocaleString(), unit: t('common.kcal'), accent: false },
                    { label: t('dashboard.currentWeight'), val: summary?.weight?.toFixed(1) ?? '—', unit: 'kg ' + t('common.today'), accent: false },
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
                    <div className={styles.cardTitle}>{t('dashboard.calorieToday')}</div>
                    <CalorieDonut consumed={consumed} target={target} />
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>{t('dashboard.diaryToday')}</div>
                        <Link to="/diary" className={styles.cardLink}>{t('dashboard.viewAll')}</Link>
                    </div>
                    {consumed === 0 ? (
                        <div className={styles.emptyState}>
                            <p>{t('dashboard.noMealYet')}</p>
                            <Link to="/diary" className={styles.addMealLink}>{t('dashboard.addMeal')}</Link>
                        </div>
                    ) : (
                        <div className={styles.diaryTotal}>
                            <span className={styles.diaryTotalLabel}>{t('dashboard.total')}</span>
                            <span className={styles.diaryTotalVal}>{consumed.toLocaleString()} kcal</span>
                        </div>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>{t('dashboard.reminders')}</div>
                    <ReminderCard exerciseMinutes={summary ? 30 : 0} />
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>{t('dashboard.updateWeight')}</div>
                    <WeightCard />
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;



