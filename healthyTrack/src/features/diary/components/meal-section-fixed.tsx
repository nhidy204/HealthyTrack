import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MealGroup, MealType } from '@diary/diary.types';
import styles from './meal-section.module.css';

interface MealSectionProps {
  meal: MealGroup;
  onAdd: (mealType: MealType) => void;
  onDelete: (id: string) => void;
}

const MealSection: React.FC<MealSectionProps> = ({
  meal,
  onAdd,
  onDelete,
}) => {
  const { t } = useTranslation();

  const mealLabels = useMemo(
    () => ({
      breakfast: t('diary.breakfast'),
      lunch: t('diary.lunch'),
      dinner: t('diary.dinner'),
      snack: t('diary.snack'),
    }),
    [t]
  );

  const mealLabel = useMemo(
    () => mealLabels[meal.mealType] || meal.label,
    [mealLabels, meal.mealType, meal.label]
  );

  const handleAdd = useCallback(() => {
    onAdd(meal.mealType);
  }, [onAdd, meal.mealType]);

  const caloriesDisplay = useMemo(
    () =>
      meal.totalCalories > 0
        ? meal.totalCalories.toLocaleString() + ' kcal'
        : '—',
    [meal.totalCalories]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete(id);
    },
    [onDelete]
  );

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>{meal.icon}</span>
          <span className={styles.name}>{mealLabel}</span>
          <span className={styles.badge}>{caloriesDisplay}</span>
        </div>
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          type="button"
        >
          {t('components.addFood')}
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {meal.foods.length === 0 ? (
          <div className={styles.empty}>
            {t('diary.noFood')} —{' '}
            <button
              className={styles.emptyLink}
              onClick={handleAdd}
              type="button"
            >
              {t('diary.addNow')}
            </button>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className={styles.colHeaders}>
              <span className={styles.colName}>{t('diary.foodName')}</span>
              <span className={styles.colAmount}>{t('diary.portion')}</span>
              <span className={styles.colKcal}>{t('diary.calories')}</span>
              <span className={styles.colDeleteBtn} />
            </div>

            {meal.foods.map((food) => (
              <div key={food._id} className={styles.foodRow}>
                <span className={styles.foodName}>{food.name}</span>
                <span className={styles.foodAmount}>{food.amount}</span>
                <span className={styles.foodKcal}>
                  {food.calories.toLocaleString()} kcal
                </span>
                <button
                  className={styles.delBtn}
                  onClick={() => handleDelete(food._id)}
                  type="button"
                  title={t('components.deleteBtnTitle')}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Meal total */}
            <div className={styles.mealTotal}>
              <span>{t('diary.mealTotal')}</span>
              <span>{meal.totalCalories.toLocaleString()} kcal</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

MealSection.displayName = 'MealSection';
export default React.memo(MealSection);



