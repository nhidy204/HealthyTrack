import React from 'react';
import { useWaterLog, useLogWater } from '@shared/hooks/use-dashboard.hook';
import { useTranslation } from 'react-i18next';
import styles from './reminder-card.module.css';

const WATER_TARGET = 8;
const EXERCISE_TARGET = 60;

interface ReminderCardProps {
    exerciseMinutes?: number;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ exerciseMinutes = 0 }) => {
    const { t } = useTranslation();
    const today = new Date().toISOString().split('T')[0];
    const { data: waterLog } = useWaterLog(today);
    const logWater = useLogWater();

    const glasses = waterLog?.glasses ?? 0; 
    const waterPct = Math.min((glasses / WATER_TARGET) * 100, 100); //đảm bảo ko vượt quá thanh dù uống nhiều hơn
    const exercisePct = Math.min((exerciseMinutes / EXERCISE_TARGET) * 100, 100);

    const addGlass = () => {
        if (glasses >= WATER_TARGET) return;
        logWater.mutate({ glasses: glasses + 1, date: today });
    };

    // thời gian nhắc húp nước cứ bắt đầu 7am mỗi ngày, và 2 tiếng nhắc 1 lần 
    const now = new Date();
    const nextHour = Math.ceil((now.getHours() - 7) / 2) * 2 + 7;
    const nextReminder = nextHour <= 21
        ? `${String(nextHour).padStart(2, '0')}:00`
        : t('diary.addNow');

    return (
        <div>
            <div className={styles.reminderRow}>
                {/* Water */}
                <div className={styles.reminderBox}>
                    <div className={styles.reminderIcon}>💧</div>
                    <div className={styles.reminderLabel}>{t('components.water')}</div>
                    <div className={styles.reminderVal}>{glasses} / {WATER_TARGET} {t('components.glasses')}</div>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: waterPct + '%', '--fill-color': '#378ADD' } as React.CSSProperties}
                        />
                    </div>
                    <button className={styles.addBtn} onClick={addGlass} disabled={glasses >= WATER_TARGET}>
                        {t('components.addMealGlass')}
                    </button>
                </div>

                {/* Exercise */}
                <div className={styles.reminderBox}>
                    <div className={styles.reminderIcon}>🏃</div>
                    <div className={styles.reminderLabel}>{t('components.exercise')}</div>
                    <div className={styles.reminderVal}>{exerciseMinutes} / {EXERCISE_TARGET} {t('components.minutes')}</div>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: exercisePct + '%', '--fill-color': '#0f6e56' } as React.CSSProperties}
                        />
                    </div>
                    <div className={styles.reminderHint}>{t('components.goalPerDay', { target: EXERCISE_TARGET })}</div>
                </div>
            </div>

            <p className={styles.nextReminder}>
                {t('components.nextReminder')} <strong>{nextReminder}</strong>
            </p>
        </div>
    );
};

export default ReminderCard;



