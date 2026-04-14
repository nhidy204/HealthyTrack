import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type OnboardingFormData } from '@schemas/onboarding.schema';
import Input from '@ui/input';
import styles from './steps.module.css';

const BasicInfoStep: React.FC = () => {
    const { t } = useTranslation();
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<OnboardingFormData>();

    const gender = watch('gender');

    return (
        <div>
            <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>{t('onboarding.gender')}</span>
                <div className={styles.genderGroup}>
                    {[
                        { value: 'male', icon: '♂', label: t('onboarding.male') },
                        { value: 'female', icon: '♀', label: t('onboarding.female') },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.genderBtn} ${gender === opt.value ? styles.selected : ''}`}
                            onClick={() => setValue('gender', opt.value as 'male' | 'female', { shouldValidate: true })}
                        >
                            <span className={styles.genderIcon}>{opt.icon}</span>
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>
                {errors.gender && <p className={styles.errorMsg}>{errors.gender.message}</p>}
            </div>

            <div className={styles.fieldRow}>
                <Input
                    label={t('onboarding.age')}
                    type="number"
                    placeholder="25"
                    suffix={t('common.years')}
                    error={errors.age?.message}
                    {...register('age', { valueAsNumber: true })}
                />
                <Input
                    label={t('onboarding.height')}
                    type="number"
                    placeholder="170"
                    suffix={t('common.cm')}
                    error={errors.height?.message}
                    {...register('height', { valueAsNumber: true })}
                />
                <Input
                    label={t('onboarding.weight')}
                    type="number"
                    placeholder="65"
                    suffix={t('common.kg')}
                    error={errors.weight?.message}
                    {...register('weight', { valueAsNumber: true })}
                />
            </div>
        </div>
    );
};

export default BasicInfoStep;
