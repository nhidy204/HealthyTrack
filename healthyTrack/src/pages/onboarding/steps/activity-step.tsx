import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingForm } from '../../../types/onboarding-types';
import { ACTIVITY_OPTIONS } from '../../../types/onboarding-types';
import styles from './steps.module.css';

const ActivityStep: React.FC = () => {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<OnboardingForm>();

    const activityLevel = watch('activityLevel');

    return (
        <div>
            <div className={styles.activityList}>
                {ACTIVITY_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`${styles.activityBtn} ${activityLevel === opt.value ? styles.selected : ''}`}
                        onClick={() => setValue('activityLevel', opt.value, { shouldValidate: true })}
                    >
                        <div className={`${styles.activityDot} ${activityLevel === opt.value ? styles.dotSelected : ''}`} />
                        <div>
                            <div className={styles.activityName}>{opt.label}</div>
                            <div className={styles.activityDesc}>{opt.description}</div>
                        </div>
                    </button>
                ))}
            </div>
            {errors.activityLevel && <p className={styles.errorMsg}>{errors.activityLevel.message}</p>}
        </div>
    );
};

export default ActivityStep;
