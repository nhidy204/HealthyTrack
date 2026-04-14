import React, { useState, useMemo } from 'react';
import AppLayout from '@shared/components/layout/app-layout';
import MealSection from '@diary/components/meal-section';
import AddFoodModal from '@diary/components/add-food-modal';
import { useDiaryEntries, useAddFoodEntry, useDeleteFoodEntry, groupByMeal } from '@shared/hooks/use-diary';
import { useProfile } from '@shared/hooks/use-onboarding';
import type { MealType } from '@diary/diary.types';
import DiaryCalendar from '@diary/components/diary-calendar';
import { useMonthlyCalories } from '@shared/hooks/use-monthly-calories';
import { useTranslation } from 'react-i18next';
import styles from './diary-page.module.css';

function toIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function addDays(date: Date, n: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

const DiaryPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewDate, setViewDate] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(), // 0-based45
    });
    const [modalMeal, setModalMeal] = useState<MealType | null>(null);

    const dateStr = toIso(currentDate);
    const isToday = dateStr === toIso(new Date());

    const { data: entries = [], isLoading } = useDiaryEntries(dateStr);
    const { data: profile } = useProfile();
    const { data: monthlyCalories = {} } = useMonthlyCalories(viewDate.year, viewDate.month);
    const addEntry = useAddFoodEntry(dateStr);
    const deleteEntry = useDeleteFoodEntry(dateStr);

    const mealGroups = useMemo(() => groupByMeal(entries), [entries]);
    const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
    const target = profile?.targetCalories ?? 0;
    const pct = target > 0 ? Math.min((totalCalories / target) * 100, 100) : 0;
    const isOver = totalCalories > target;

    const handleAdd = (data: {
        name: string; amount: string; calories: number; mealType: MealType; date: string;
    }) => {
        addEntry.mutate(data, { onSuccess: () => setModalMeal(null) });
    };

    const handleSelectDate = (iso: string) => {
        const [y, m, d] = iso.split('-').map(Number);
        setCurrentDate(new Date(y, m - 1, d));
        setViewDate({ year: y, month: m - 1 }); // đồng bộ viewDate khi chọn ngày
    };

    const handleViewDateChange = (year: number, month: number) => {
        setViewDate({ year, month }); // month là 0-based từ DiaryCalendar
    };

    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const dayLabel = isToday
        ? t('diary.today')
        : currentDate.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <AppLayout title={t('diary.title')}>
            <div className={styles.layout}>
                {/* Left — diary content */}
                <div className={styles.main}>
                    <div className={styles.dateNav}>
                        <button className={styles.dateBtn} onClick={() => setCurrentDate(d => addDays(d, -1))}>←</button>
                        <div>
                            <div className={styles.dateLabel}>{dayLabel}</div>
                            <div className={styles.dateSub}>
                                {currentDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <button
                            className={styles.dateBtn}
                            onClick={() => { if (!isToday) setCurrentDate(d => addDays(d, 1)); }}
                            disabled={isToday}
                        >→</button>
                    </div>

                    {target > 0 && (
                        <div className={styles.caloBar}>
                            <div className={styles.caloBarRow}>
                                <span>
                                    {t('diary.consumed')}{' '}
                                    <strong className={isOver ? styles.consumedOver : styles.consumedNormal}>
                                        {totalCalories.toLocaleString()}
                                    </strong>{' '}
                                    kcal
                                </span>
                                <span>{t('diary.target')} {target.toLocaleString()} kcal</span>
                            </div>
                            <div className={styles.bar}>
                                <div
                                    className={`${styles.barFill} ${isOver ? styles.barOver : ''}`}
                                    style={{ '--fill-width': pct + '%' } as React.CSSProperties}
                                />
                            </div>
                            {isOver && (
                                <div className={styles.overWarning}>
                                    {t('diary.exceeded')} {(totalCalories - target).toLocaleString()} {t('diary.than')}
                                </div>
                            )}
                        </div>
                    )}

                    {isLoading ? (
                        <div className={styles.loading}>{t('diary.loading')}</div>
                    ) : (
                        mealGroups.map((meal) => (
                            <MealSection
                                key={meal.mealType}
                                meal={meal}
                                onAdd={setModalMeal}
                                onDelete={(id) => deleteEntry.mutate(id)}
                            />
                        ))
                    )}

                    {totalCalories > 0 && (
                        <div className={styles.dailyTotal}>
                            <span>{t('diary.dailyTotal')}</span>
                            <span className={isOver ? styles.dailyTotalOver : styles.dailyTotalNormal}>
                                {totalCalories.toLocaleString()} kcal
                            </span>
                        </div>
                    )}
                </div>

                {/* calendar */}
                <div className={styles.sidebar}>
                    <DiaryCalendar
                        selectedDate={dateStr}
                        targetCalories={target}
                        dailyCalories={monthlyCalories}
                        onSelectDate={handleSelectDate}
                        onViewDateChange={handleViewDateChange}
                        locale={i18n.language}
                    />
                </div>
            </div>

            {modalMeal && (
                <AddFoodModal
                    mealType={modalMeal}
                    date={dateStr}
                    onAdd={handleAdd}
                    onClose={() => setModalMeal(null)}
                    isLoading={addEntry.isPending}
                />
            )}
        </AppLayout>
    );
};

export default DiaryPage;


