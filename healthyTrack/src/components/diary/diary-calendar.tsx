import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './diary-calendar.module.css';

interface DiaryCalendarProps {
  selectedDate: string;
  targetCalories: number;
  dailyCalories: Record<string, number>;
  onSelectDate: (iso: string) => void;
  onViewDateChange?: (year: number, month: number) => void;
  locale?: string;
}

const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOWS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DOWS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toIsoLocal(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayIso(): string {
  const d = new Date();
  return toIsoLocal(d.getFullYear(), d.getMonth(), d.getDate());
}

type Status = 'ok' | 'over' | 'none' | 'future';

const DiaryCalendar: React.FC<DiaryCalendarProps> = ({
  selectedDate,
  targetCalories,
  dailyCalories,
  onSelectDate,
  onViewDateChange,
  locale = 'vi',
}) => {
  const { t } = useTranslation();
  const today = todayIso();

  const initYear = parseInt(selectedDate.split('-')[0]);
  const initMonth = parseInt(selectedDate.split('-')[1]) - 1;

  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const MONTHS = locale === 'vi' ? MONTHS_VI : MONTHS_EN;
  const DOWS = locale === 'vi' ? DOWS_VI : DOWS_EN;

  const changeMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
    if (onViewDateChange) onViewDateChange(y, m);
  };

  const todayYear = parseInt(today.split('-')[0]);
  const todayMonth = parseInt(today.split('-')[1]) - 1;
  const isCurrentOrFutureMonth =
    viewYear > todayYear ||
    (viewYear === todayYear && viewMonth >= todayMonth);

  // First day of month — day of week (Mon=0)
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const startDow = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const getStatus = (iso: string): Status => {
    if (iso > today) return 'future';
    const kcal = dailyCalories[iso];
    if (!kcal || kcal === 0) return 'none';
    if (kcal > targetCalories) return 'over';
    return 'ok';
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={() => changeMonth(-1)} type="button">←</button>
        <span className={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
        <button
          className={styles.navBtn}
          onClick={() => changeMonth(1)}
          disabled={isCurrentOrFutureMonth}
          type="button"
        >→</button>
      </div>

      <div className={styles.grid}>
        {DOWS.map(d => (
          <div key={d} className={styles.dow}>{d}</div>
        ))}

        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toIsoLocal(viewYear, viewMonth, day);
          const status = getStatus(iso);
          const isSelected = iso === selectedDate;
          const isToday = iso === today;

          return (
            <button
              key={iso}
              type="button"
              disabled={status === 'future'}
              onClick={() => onSelectDate(iso)}
              className={[
                styles.day,
                styles[`status_${status}`],
                isSelected ? styles.selected : '',
                isToday ? styles.today : '',
              ].join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.status_ok}`} />
          {t('diary.onTarget')}
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.status_over}`} />
          {t('diary.overCalories')}
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.status_none}`} />
          {t('diary.noData')}
        </div>
      </div>
    </div>
  );
};

export default DiaryCalendar;