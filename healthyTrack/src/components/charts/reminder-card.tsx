import React from 'react';
import { useWaterLog, useLogWater } from '../../hooks/use-dashboard';
import styles from './reminder-card.module.css';

const WATER_TARGET = 8;
const EXERCISE_TARGET = 60;

interface ReminderCardProps {
    exerciseMinutes?: number;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ exerciseMinutes = 0 }) => {
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
        : 'Đã xong hôm nay';

    return (
        <div>
            <div className={styles.reminderRow}>
                {/* Water */}
                <div className={styles.reminderBox}>
                    <div className={styles.reminderIcon}>💧</div>
                    <div className={styles.reminderLabel}>Uống nước</div>
                    <div className={styles.reminderVal}>{glasses} / {WATER_TARGET} ly</div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: waterPct + '%', background: '#378ADD' }} />
                    </div>
                    <button className={styles.addBtn} onClick={addGlass} disabled={glasses >= WATER_TARGET}>
                        + Thêm ly
                    </button>
                </div>

                {/* Exercise */}
                <div className={styles.reminderBox}>
                    <div className={styles.reminderIcon}>🏃</div>
                    <div className={styles.reminderLabel}>Vận động</div>
                    <div className={styles.reminderVal}>{exerciseMinutes} / {EXERCISE_TARGET} phút</div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: exercisePct + '%', background: '#0f6e56' }} />
                    </div>
                    <div className={styles.reminderHint}>Mục tiêu 60 phút/ngày</div>
                </div>
            </div>

            <p className={styles.nextReminder}>
                Nhắc uống nước tiếp theo lúc <strong>{nextReminder}</strong>
            </p>
        </div>
    );
};

export default ReminderCard;
