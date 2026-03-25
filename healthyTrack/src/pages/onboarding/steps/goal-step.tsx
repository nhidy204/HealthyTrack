import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingForm } from '../../../types/onboarding-types';
import { GOAL_OPTIONS } from '../../../types/onboarding-types';
import styles from './steps.module.css';

const GoalStep: React.FC = () => {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<OnboardingForm>();

    const goal = watch('goal');

    return (
        <div>
            <div className={styles.goalGroup}>
                {GOAL_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`${styles.goalBtn} ${goal === opt.value ? styles.selected : ''}`}
                        onClick={() => setValue('goal', opt.value, { shouldValidate: true })}
                    >
                        <span className={styles.goalIcon}>{opt.icon}</span>
                        <span className={styles.goalName}>{opt.label}</span>
                        <span className={styles.goalDesc}>{opt.description}</span>
                    </button>
                ))}
            </div>
            {errors.goal && <p className={styles.errorMsg}>{errors.goal.message}</p>}
        </div>
    );
};

export default GoalStep;
