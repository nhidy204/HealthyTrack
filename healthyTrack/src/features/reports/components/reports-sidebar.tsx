import React from 'react';
import type { SidebarStats } from '@reports/reports.types';
import styles from './reports-sidebar.module.css';

interface ReportsSidebarProps {
  data: SidebarStats | undefined;
  isLoading: boolean;
  locale?: string;
}

const DAY_LABELS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_LABELS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const ReportsSidebar: React.FC<ReportsSidebarProps> = ({
  data, isLoading, locale = 'vi',
}) => {
  const DAY_LABELS = locale === 'vi' ? DAY_LABELS_VI : DAY_LABELS_EN;
  const isVi = locale === 'vi';

  if (isLoading) {
    return (
      <div className={styles.sidebar}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${styles.card} ${styles.skeleton}`} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { streak, maxStreak, last7Logged, goalDays, weekDays, topFoods, comparison } = data;
  const diff = comparison.diff;
  const diffAbs = Math.abs(diff);

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          {isVi ? 'Streak ghi nhật ký' : 'Logging streak'}
        </div>
        <div className={styles.streakRow}>
          <div className={styles.streakNum}>{streak}</div>
          <div>
            <div className={styles.streakLabel}>
              {isVi ? 'ngày liên tiếp' : 'days in a row'}
            </div>
            <div className={styles.streakRecord}>
              {isVi ? `Kỷ lục: ${maxStreak} ngày` : `Record: ${maxStreak} days`}
            </div>
          </div>
        </div>
        <div className={styles.last7}>
          {last7Logged.map((logged, i) => (
            <div
              key={i}
              className={`${styles.last7Dot} ${logged ? styles.dotLogged : styles.dotMissed}`}
              title={DAY_LABELS[i]}
            />
          ))}
        </div>
        <div className={styles.last7Label}>
          {isVi ? '7 ngày gần nhất' : 'Last 7 days'}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          {isVi ? 'Đạt mục tiêu tuần này' : 'Goal days this week'}
        </div>
        <div className={styles.goalBig}>
          {goalDays}
          <span className={styles.goalTotal}>/7</span>
        </div>
        <div className={styles.goalSub}>
          {isVi ? 'ngày đạt mục tiêu calo' : 'days on target'}
        </div>
        <div className={styles.weekDots}>
          {weekDays.map((day, i) => (
            <div
              key={day.date}
              className={`${styles.weekDot} ${styles[`weekDot_${day.status}`]}`}
              title={DAY_LABELS[i]}
            >
              {DAY_LABELS[i]}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          {isVi ? 'Món ăn thường xuyên nhất' : 'Most frequent foods'}
        </div>
        {topFoods.length === 0 ? (
          <div className={styles.empty}>
            {isVi ? 'Chưa có dữ liệu tuần này' : 'No data this week'}
          </div>
        ) : (
          topFoods.map((food, i) => (
            <div key={food.name} className={styles.foodItem}>
              <div className={styles.foodRank}>{i + 1}</div>
              <div className={styles.foodName}>{food.name}</div>
              <div className={styles.foodCount}>
                {food.count} {isVi ? 'lần' : 'times'}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          {isVi ? 'So sánh với tuần trước' : 'vs last week'}
        </div>
        <div className={styles.compareRow}>
          <div className={styles.compareCol}>
            <div className={styles.compareLabel}>
              {isVi ? 'Tuần trước' : 'Last week'}
            </div>
            <div className={styles.compareVal}>
              {comparison.prevAvg > 0 ? comparison.prevAvg.toLocaleString() : '—'}
            </div>
            <div className={styles.compareUnit}>kcal/ngày</div>
          </div>
          <div className={styles.compareArrow}>→</div>
          <div className={styles.compareCol}>
            <div className={styles.compareLabel}>
              {isVi ? 'Tuần này' : 'This week'}
            </div>
            <div className={styles.compareVal}>
              {comparison.thisAvg > 0 ? comparison.thisAvg.toLocaleString() : '—'}
            </div>
            <div className={styles.compareUnit}>kcal/ngày</div>
          </div>
        </div>

        {comparison.prevAvg > 0 && comparison.thisAvg > 0 && (
          <div className={`${styles.compareDiff} ${diff > 0 ? styles.diffUp : diff < 0 ? styles.diffDown : styles.diffSame
            }`}>
            {diff > 0
              ? `↑ ${isVi ? 'Tăng' : 'Up'} ${diffAbs.toLocaleString()} kcal — ${isVi ? 'chú ý nhé!' : 'watch out!'}`
              : diff < 0
                ? `↓ ${isVi ? 'Giảm' : 'Down'} ${diffAbs.toLocaleString()} kcal — ${isVi ? 'tốt!' : 'great!'}`
                : isVi ? '= Không đổi' : '= No change'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsSidebar;


