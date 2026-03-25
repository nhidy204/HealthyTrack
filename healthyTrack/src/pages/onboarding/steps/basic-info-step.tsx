import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingForm } from '../../../types/onboarding-types';
import Input from '../../../components/ui/input';
import styles from './steps.module.css';

const BasicInfoStep: React.FC = () => {
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
                <span className={styles.fieldLabel}>Giới tính</span>
                <div className={styles.genderGroup}>
                    {[
                        { value: 'male', icon: '♂', label: 'Nam' },
                        { value: 'female', icon: '♀', label: 'Nữ' },
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
                    label="Tuổi"
                    type="number"
                    placeholder="25"
                    suffix="tuổi"
                    error={errors.age?.message}
                    {...register('age', {
                        required: 'Vui lòng nhập tuổi.',
                        min: { value: 10, message: 'Tuổi tối thiểu là 10.' },
                        max: { value: 100, message: 'Tuổi tối đa là 100.' },
                        valueAsNumber: true,
                    })}
                />
                <Input
                    label="Chiều cao"
                    type="number"
                    placeholder="170"
                    suffix="cm"
                    error={errors.height?.message}
                    {...register('height', {
                        required: 'Vui lòng nhập chiều cao.',
                        min: { value: 100, message: 'Chiều cao tối thiểu 100cm.' },
                        max: { value: 250, message: 'Chiều cao tối đa 250cm.' },
                        valueAsNumber: true,
                    })}
                />
                <Input
                    label="Cân nặng"
                    type="number"
                    placeholder="65"
                    suffix="kg"
                    error={errors.weight?.message}
                    {...register('weight', {
                        required: 'Vui lòng nhập cân nặng.',
                        min: { value: 20, message: 'Cân nặng tối thiểu 20kg.' },
                        max: { value: 300, message: 'Cân nặng tối đa 300kg.' },
                        valueAsNumber: true,
                    })}
                />
            </div>
        </div>
    );
};

export default BasicInfoStep;
