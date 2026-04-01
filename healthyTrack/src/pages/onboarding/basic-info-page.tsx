import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { OnboardingForm } from '../../types/onboarding-types';
import { calcNutritionPlan } from '../../utils/nutrition';
import { useSaveProfile } from '../../hooks/use-onboarding';
import BasicInfoStep from './steps/basic-info-step';
import GoalStep from './steps/goal-step';
import ActivityStep from './steps/activity-step';
import ResultStep from './steps/result-step';
import Button from '../../components/ui/button';
import styles from './basic-info-page.module.css';

const STEPS = [
    { label: 'Thông tin cơ bản', subtitle: 'Giúp chúng tôi tính toán chính xác nhu cầu calo của bạn.' },
    { label: 'Mục tiêu của bạn', subtitle: 'Chọn mục tiêu để chúng tôi điều chỉnh lượng calo phù hợp.' },
    { label: 'Mức độ vận động', subtitle: 'Chọn mức độ vận động trung bình mỗi tuần của bạn.' },
    { label: 'Kế hoạch của bạn', subtitle: 'Dựa trên thông tin đã cung cấp, đây là mục tiêu calo hàng ngày của bạn.' },
];

const STEP_FIELDS: (keyof OnboardingForm)[][] = [
    ['gender', 'age', 'height', 'weight'],
    ['goal'],
    ['activityLevel'],
    [],
];

const BasicInfoPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const saveProfile = useSaveProfile();

    const methods = useForm<OnboardingForm>({
        mode: 'onTouched',
        defaultValues: {
            gender: undefined,
            age: undefined,
            height: undefined,
            weight: undefined,
            goal: undefined,
            activityLevel: undefined,
        },
    });

    const { handleSubmit, trigger } = methods;

    const goNext = async () => {
        const fields = STEP_FIELDS[currentStep];
        const valid = fields.length === 0 || await trigger(fields);
        if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0)); 

    const onSubmit = (data: OnboardingForm) => {
        const plan = calcNutritionPlan(
            { gender: data.gender, age: data.age, height: data.height, weight: data.weight },
            data.goal,
            data.activityLevel
        );
        saveProfile.mutate({ ...data, targetCalories: plan.targetCalories });
    };

    const stepComponents = [
        <BasicInfoStep key="basic" />,
        <GoalStep key="goal" />,
        <ActivityStep key="activity" />,
        <ResultStep key="result" />,
    ];

    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <FormProvider {...methods}>
            <div className={styles.root}>
                <div className={styles.brand}>
                    <span className={styles.brandIcon}>🌿</span>
                    <span className={styles.brandName}>HealthyTrack</span>
                </div>

                <div className={styles.progressBar}>
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={[
                                styles.progressStep,
                                i < currentStep ? styles.done : '',
                                i === currentStep ? styles.active : '',
                            ].join(' ')}
                        />
                    ))}
                </div>

                <div className={styles.stepLabel}>Bước {currentStep + 1} / {STEPS.length}</div>
                <h1 className={styles.stepTitle}>{STEPS[currentStep].label}</h1>
                <p className={styles.stepSub}>{STEPS[currentStep].subtitle}</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {stepComponents[currentStep]}

                    {saveProfile.isError && (
                        <div className={styles.alertError}>
                            {(saveProfile.error as Error)?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.'}
                        </div>
                    )}

                    <div className={styles.btnRow}>
                        {currentStep > 0 && (
                            <Button type="button" variant="ghost" onClick={goBack}>
                                ← Quay lại
                            </Button>
                        )}
                        {isLastStep ? (
                            <Button type="submit" loading={saveProfile.isPending}>
                                Bắt đầu theo dõi →
                            </Button>
                        ) : (
                            <Button type="button" fullWidth={currentStep === 0} onClick={goNext}>
                                Tiếp theo →
                            </Button>
                        )}
                    </div>
                </form>

                {currentStep === 0 && (
                    <p className={styles.skipText}>
                        Đã thiết lập trước đó?{' '}
                        <button type="button" className={styles.skipLink} onClick={() => navigate('/dashboard')}>
                            Bỏ qua
                        </button>
                    </p>
                )}
            </div>
        </FormProvider>
    );
};

export default BasicInfoPage;
