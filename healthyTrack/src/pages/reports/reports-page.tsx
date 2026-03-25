import React, { useState } from 'react';
import AppLayout from '../../components/layout/app-layout';
import WeightLineChart from '../../components/charts/weight-line-chart';
import CalorieBarChart from '../../components/charts/calorie-bar-chart';
import { useWeeklyReport } from '../../hooks/use-reports';
import styles from './reports-page.module.css';

const ReportsPage: React.FC = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const { data: report, isLoading } = useWeeklyReport(weekOffset);

    const isCurrentWeek = weekOffset === 0;
    const weightChange = report?.weightChange ?? 0;

    return (
        <AppLayout title="Báo cáo & Phân tích">
            <div className={styles.root}>

                {/* 2eek navigator */}
                <div className={styles.weekNav}>
                    <button className={styles.weekBtn} onClick={() => setWeekOffset(w => w - 1)}>← Tuần trước</button>
                    <span className={styles.weekLabel}>
                        {isCurrentWeek ? 'Tuần này' : `${weekOffset < 0 ? Math.abs(weekOffset) : ''} tuần trước`}
                    </span>
                    <button className={styles.weekBtn} onClick={() => setWeekOffset(w => w + 1)} disabled={isCurrentWeek}>
                        Tuần sau →
                    </button>
                </div>

                {/*summary stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Cân nặng hiện tại</div>
                        <div className={styles.statVal}>{report?.weightEnd?.toFixed(1) ?? '—'}</div>
                        <div className={styles.statUnit}>kg</div>
                    </div>
                    <div className={`${styles.statCard} ${weightChange <= 0 ? styles.green : styles.red}`}>
                        <div className={styles.statLabel}>Thay đổi</div>
                        <div className={styles.statVal}>
                            {weightChange > 0 ? '+' : ''}{weightChange?.toFixed(1) ?? '—'}
                        </div>
                        <div className={styles.statUnit}>kg tuần này</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>TB calo / ngày</div>
                        <div className={styles.statVal}>{report?.avgCalories?.toLocaleString() ?? '—'}</div>
                        <div className={styles.statUnit}>kcal (mục tiêu {report?.targetCalories?.toLocaleString()})</div>
                    </div>
                </div>

                {/* ưeight chart */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Cân nặng theo ngày (kg)</div>
                    {isLoading ? (
                        <div className={styles.loading}>Đang tải...</div>
                    ) : (
                        <WeightLineChart data={report?.dailyWeights ?? []} />
                    )}
                </div>

                {/* calorie chart */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Lượng calo tiêu thụ theo ngày (kcal)</div>
                    {isLoading ? (
                        <div className={styles.loading}>Đang tải...</div>
                    ) : (
                        <CalorieBarChart data={report?.dailyCalories ?? []} target={report?.targetCalories ?? 0} />
                    )}
                </div>

            </div>
        </AppLayout>
    );
};

export default ReportsPage;
