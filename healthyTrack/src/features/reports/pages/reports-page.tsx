import React, { useState } from 'react';
import AppLayout from '@shared/components/layout/app-layout';
import WeightLineChart from '@dashboard/components/weight-line-chart';
import CalorieBarChart from '@dashboard/components/calorie-bar-chart';
import ReportsSidebar from '@reports/components/reports-sidebar';
import { useWeeklyReport, useSidebarStats } from '@shared/hooks/use-reports';
import { useTranslation } from 'react-i18next';
import styles from './reports-page.module.css';

const ReportsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: report, isLoading } = useWeeklyReport(weekOffset);
  const { data: sidebar, isLoading: sidebarLoading } = useSidebarStats(weekOffset);

  const isCurrentWeek = weekOffset === 0;
  const weightChange = report?.weightChange ?? 0;

  return (
    <AppLayout title={t('reports.title')}>
      <div className={styles.root}>

        {/* Left — charts */}
        <div className={styles.mainContent}>
          <div className={styles.weekNav}>
            <button className={styles.weekBtn} onClick={() => setWeekOffset(w => w - 1)}>
              ← {t('reports.prevWeek')}
            </button>
            <span className={styles.weekLabel}>
              {isCurrentWeek
                ? t('reports.thisWeek')
                : `${Math.abs(weekOffset)} ${t('reports.weeksAgo')}`}
            </span>
            <button
              className={styles.weekBtn}
              onClick={() => setWeekOffset(w => w + 1)}
              disabled={isCurrentWeek}
            >
              {t('reports.nextWeek')} →
            </button>
          </div>

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
              <div className={styles.statUnit}>
                kcal ({t('common.target')} {report?.targetCalories?.toLocaleString()})
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>{t('reports.weightChart')}</div>
            {isLoading
              ? <div className={styles.loading}>{t('common.loading')}</div>
              : <WeightLineChart data={report?.dailyWeights ?? []} />
            }
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>{t('reports.calorieChart')}</div>
            {isLoading
              ? <div className={styles.loading}>{t('common.loading')}</div>
              : <CalorieBarChart
                data={report?.dailyCalories ?? []}
                target={report?.targetCalories ?? 0}
              />
            }
          </div>
        </div>

        <div className={styles.sidebar}>
          <ReportsSidebar
            data={sidebar}
            isLoading={sidebarLoading}
            locale={i18n.language}
          />
        </div>

      </div>
    </AppLayout>
  );
};

export default ReportsPage;


