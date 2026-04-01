import React, { useState } from 'react';
import AppLayout from '../../components/layout/app-layout';
import WeightLineChart from '../../components/charts/weight-line-chart';
import CalorieBarChart from '../../components/charts/calorie-bar-chart';
import { useWeeklyReport } from '../../hooks/use-reports';
import { useTranslation } from 'react-i18next';
import styles from './reports-page.module.css';

const ReportsPage: React.FC = () => {
    const { t } = useTranslation();
    const [weekOffset, setWeekOffset] = useState(0);
    const { data: report, isLoading } = useWeeklyReport(weekOffset);

    const isCurrentWeek = weekOffset === 0;
    const weightChange = report?.weightChange ?? 0;

    return (
        <AppLayout title={t('reports.title')}>
            <div className={styles.root}>

                {/* Week navigator */}
                <div className={styles.weekNav}>
                    <button className={styles.weekBtn} onClick={() => setWeekOffset(w => w - 1)}>← {t('reports.prevWeek')}</button>
                    <span className={styles.weekLabel}>
                        {isCurrentWeek ? t('reports.thisWeek') : `${weekOffset < 0 ? Math.abs(weekOffset) : ''} ${t('reports.prevWeek')}`}
                    </span>
                    <button className={styles.weekBtn} onClick={() => setWeekOffset(w => w + 1)} disabled={isCurrentWeek}>
                        {t('reports.nextWeek')} →
                    </button>
                </div>

                {/* Summary stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>{t('reports.currentWeight')}</div>
                        <div className={styles.statVal}>{report?.weightEnd?.toFixed(1) ?? '—'}</div>
                        <div className={styles.statUnit}>{t('common.kg')}</div>
                    </div>
                    <div className={`${styles.statCard} ${weightChange <= 0 ? styles.green : styles.red}`}>
                        <div className={styles.statLabel}>{t('reports.change')}</div>
                        <div className={styles.statVal}>
                            {weightChange > 0 ? '+' : ''}{weightChange?.toFixed(1) ?? '—'}
                        </div>
                        <div className={styles.statUnit}>{t('common.kg')} {t('reports.thisWeek')}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>{t('reports.avgCalories')}</div>
                        <div className={styles.statVal}>{report?.avgCalories?.toLocaleString() ?? '—'}</div>
                        <div className={styles.statUnit}>kcal ({t('common.target')} {report?.targetCalories?.toLocaleString()})</div>
                    </div>
                </div>

                {/* Weight chart */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>{t('reports.weightChart')}</div>
                    {isLoading ? (
                        <div className={styles.loading}>{t('reports.loading')}</div>
                    ) : (
                        <WeightLineChart data={report?.dailyWeights ?? []} />
                    )}
                </div>

                {/* Calorie chart */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>{t('reports.calorieChart')}</div>
                    {isLoading ? (
                        <div className={styles.loading}>{t('reports.loading')}</div>
                    ) : (
                        <CalorieBarChart data={report?.dailyCalories ?? []} target={report?.targetCalories ?? 0} />
                    )}
                </div>

            </div>
        </AppLayout>
    );
};

export default ReportsPage;
