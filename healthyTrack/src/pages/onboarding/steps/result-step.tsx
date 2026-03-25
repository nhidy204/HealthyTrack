import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingForm } from '../../../types/onboarding-types';
import { calcNutritionPlan, goalLabel } from '../../../utils/nutrition';
import styles from './steps.module.css';

const ResultStep: React.FC = () => {
    const { watch } = useFormContext<OnboardingForm>();
    const values = watch();

    const plan = useMemo(() => {
        if (!values.gender || !values.age || !values.height || !values.weight || !values.goal || !values.activityLevel) {
            return null;
        }
        return calcNutritionPlan(
            { gender: values.gender, age: values.age, height: values.height, weight: values.weight },
            values.goal,
            values.activityLevel
        );
    }, [values]);

    if (!plan) return null;

    return (
        <div>
            <div className={styles.resultCard}>
                <p className={styles.resultHeadline}>
                    Để {goalLabel(plan.goal)}, bạn cần nạp khoảng{' '}
                    <strong>{plan.targetCalories.toLocaleString()}</strong> kcal mỗi ngày.
                </p>
                <div className={styles.resultRow}>
                    <div className={styles.resultMetric}>
                        <div className={styles.rLabel}>BMR</div>
                        <div className={styles.rVal}>{plan.bmr.toLocaleString()}</div>
                        <div className={styles.rUnit}>kcal/ngày</div>
                    </div>
                    <div className={styles.resultMetric}>
                        <div className={styles.rLabel}>TDEE</div>
                        <div className={styles.rVal}>{plan.tdee.toLocaleString()}</div>
                        <div className={styles.rUnit}>kcal/ngày</div>
                    </div>
                    <div className={`${styles.resultMetric} ${styles.highlight}`}>
                        <div className={styles.rLabel}>Mục tiêu</div>
                        <div className={styles.rVal}>{plan.targetCalories.toLocaleString()}</div>
                        <div className={styles.rUnit}>kcal/ngày</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultStep;
