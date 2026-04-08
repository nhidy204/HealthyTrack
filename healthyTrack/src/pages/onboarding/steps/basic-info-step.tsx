import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { OnboardingForm } from '@typing/onboarding-types';
import Input from '@ui/input';
import styles from './steps.module.css';

const BasicInfoStep: React.FC = () => {
    const { t } = useTranslation();
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<OnboardingForm>();

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
                    {...register('age', {
                        required: t('validation.ageRequired') || 'Vui lòng nhập tuổi.',
                        min: { value: 10, message: t('validation.ageMin') || 'Tuổi tối thiểu là 10.' },
                        max: { value: 100, message: t('validation.ageMax') || 'Tuổi tối đa là 100.' },
                        valueAsNumber: true,
                    })}
                />
                <Input
                    label={t('onboarding.height')}
                    type="number"
                    placeholder="170"
                    suffix={t('common.cm')}
                    error={errors.height?.message}
                    {...register('height', {
                        required: t('validation.heightRequired') || 'Vui lòng nhập chiều cao.',
                        min: { value: 100, message: t('validation.heightMin') || 'Chiều cao tối thiểu 100cm.' },
                        max: { value: 250, message: t('validation.heightMax') || 'Chiều cao tối đa 250cm.' },
                        valueAsNumber: true,
                    })}
                />
                <Input
                    label={t('onboarding.weight')}
                    type="number"
                    placeholder="65"
                    suffix={t('common.kg')}
                    error={errors.weight?.message}
                    {...register('weight', {
                        required: t('validation.weightRequired') || 'Vui lòng nhập cân nặng.',
                        min: { value: 20, message: t('validation.weightMin') || 'Cân nặng tối thiểu 20kg.' },
                        max: { value: 300, message: t('validation.weightMax') || 'Cân nặng tối đa 300kg.' },
                        valueAsNumber: true,
                    })}
                />
            </div>
        </div>
    );
};

export default BasicInfoStep;
