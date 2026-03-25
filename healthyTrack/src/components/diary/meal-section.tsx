import React from 'react';
import type { MealGroup, MealType } from '../../types/diary-types';
import styles from './meal-section.module.css';

interface MealSectionProps {
    meal: MealGroup;
    onAdd: (mealType: MealType) => void;
    onDelete: (id: string) => void;
}

const MealSection: React.FC<MealSectionProps> = ({ meal, onAdd, onDelete }) => {
    return (
        <div className={styles.section}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={styles.icon}>{meal.icon}</span>
                    <span className={styles.name}>{meal.label}</span>
                    <span className={styles.badge}>
                        {meal.totalCalories > 0
                            ? meal.totalCalories.toLocaleString() + ' kcal'
                            : '—'}
                    </span>
                </div>
                <button
                    className={styles.addBtn}
                    onClick={() => onAdd(meal.mealType)}
                    type="button"
                >
                    + Thêm món
                </button>
            </div>

            {/* Body */}
            <div className={styles.body}>
                {meal.foods.length === 0 ? (
                    <div className={styles.empty}>
                        Chưa có món nào —{' '}
                        <button
                            className={styles.emptyLink}
                            onClick={() => onAdd(meal.mealType)}
                            type="button"
                        >
                            thêm ngay
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Column headers */}
                        <div className={styles.colHeaders}>
                            <span className={styles.colName}>Món ăn</span>
                            <span className={styles.colAmount}>Khẩu phần</span>
                            <span className={styles.colKcal}>Calo</span>
                            <span style={{ width: 28 }} />
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
                                    onClick={() => onDelete(food._id)}
                                    type="button"
                                    title="Xóa"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Meal total */}
                        <div className={styles.mealTotal}>
                            <span>Tổng bữa</span>
                            <span>{meal.totalCalories.toLocaleString()} kcal</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MealSection;
