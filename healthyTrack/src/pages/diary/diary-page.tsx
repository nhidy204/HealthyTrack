import React, { useState, useMemo } from 'react';
import AppLayout from '../../components/layout/app-layout';
import MealSection from '../../components/diary/meal-section';
import AddFoodModal from '../../components/diary/add-food-modal';
import { useDiaryEntries, useAddFoodEntry, useDeleteFoodEntry, groupByMeal } from '../../hooks/use-diary';
import { useProfile } from '../../hooks/use-onboarding';
import type { MealType } from '../../types/diary-types';
import styles from './diary-page.module.css';

function toIso(date: Date) { return date.toISOString().split('T')[0]; }
function addDays(date: Date, n: number) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }

const DiaryPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalMeal, setModalMeal] = useState<MealType | null>(null);

    const dateStr = toIso(currentDate);
    const isToday = dateStr === toIso(new Date());

    const { data: entries = [], isLoading } = useDiaryEntries(dateStr);
    const { data: profile } = useProfile();
    const addEntry = useAddFoodEntry(dateStr);
    const deleteEntry = useDeleteFoodEntry(dateStr);

    const mealGroups = useMemo(() => groupByMeal(entries), [entries]);
    const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
    const target = profile?.targetCalories ?? 0;
    const pct = target > 0 ? Math.min((totalCalories / target) * 100, 100) : 0;
    const isOver = totalCalories > target;

    const handleAdd = (data: { name: string; amount: string; calories: number; mealType: MealType; date: string }) => {
        addEntry.mutate(data, { onSuccess: () => setModalMeal(null) });
    };

    const dayLabel = isToday
        ? 'Hôm nay'
        : currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <AppLayout title="Nhật ký ăn uống">
            <div className={styles.root}>
                <div className={styles.dateNav}>
                    <button className={styles.dateBtn} onClick={() => setCurrentDate(d => addDays(d, -1))}>←</button>
                    <div>
                        <div className={styles.dateLabel}>{dayLabel}</div>
                        <div className={styles.dateSub}>{currentDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <button className={styles.dateBtn} onClick={() => { if (!isToday) setCurrentDate(d => addDays(d, 1)); }} disabled={isToday}>→</button>
                </div>

                {target > 0 && (
                    <div className={styles.caloBar}>
                        <div className={styles.caloBarRow}>
                            <span>Đã nạp: <strong style={{ color: isOver ? '#c0392b' : '#0f6e56' }}>{totalCalories.toLocaleString()}</strong> kcal</span>
                            <span>Mục tiêu: {target.toLocaleString()} kcal</span>
                        </div>
                        <div className={styles.bar}>
                            <div className={`${styles.barFill} ${isOver ? styles.barOver : ''}`} style={{ width: pct + '%' }} />
                        </div>
                        {isOver && (
                            <div className={styles.overWarning}>
                                ⚠ Vượt {(totalCalories - target).toLocaleString()} kcal so với mục tiêu hôm nay
                            </div>
                        )}
                    </div>
                )}

                {isLoading ? (
                    <div className={styles.loading}>Đang tải...</div>
                ) : (
                    mealGroups.map((meal) => (
                        <MealSection key={meal.mealType} meal={meal} onAdd={setModalMeal} onDelete={(id) => deleteEntry.mutate(id)} />
                    ))
                )}

                {totalCalories > 0 && (
                    <div className={styles.dailyTotal}>
                        <span>Tổng calo cả ngày</span>
                        <span style={{ color: isOver ? '#c0392b' : '#0f6e56' }}>{totalCalories.toLocaleString()} kcal</span>
                    </div>
                )}
            </div>

            {modalMeal && (
                <AddFoodModal mealType={modalMeal} date={dateStr} onAdd={handleAdd} onClose={() => setModalMeal(null)} isLoading={addEntry.isPending} />
            )}
        </AppLayout>
    );
};

export default DiaryPage;
