import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { onboardingSchema, type OnboardingFormData } from '@onboarding/onboarding.schema';
import { calcNutritionPlan } from '@shared/utils/nutrition';
import { useSaveProfile, useProfile } from '@shared/hooks/use-onboarding.hook';
import LanguageSwitcher from '@ui/language-switcher';
import BasicInfoStep from './steps/basic-info-step';
import GoalStep from './steps/goal-step';
import ActivityStep from './steps/activity-step';
import ResultStep from './steps/result-step';
import Button from '@ui/button';
import styles from './basic-info-page.module.css';

const BasicInfoPage: React.FC = () => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const saveProfile = useSaveProfile();
    // Skip profile check on onboarding page - don't query /profile, user is still setting up
    const { data: profile, isLoading } = useProfile(true);

    const STEPS = [
        { label: t('onboarding.basicInfo'), subtitle: t('onboarding.basicInfoSub') },
        { label: t('onboarding.goal'), subtitle: t('onboarding.goalSub') },
        { label: t('onboarding.activity'), subtitle: t('onboarding.activitySub') },
        { label: t('onboarding.result'), subtitle: t('onboarding.resultSub') },
    ];

    const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
        ['gender', 'age', 'height', 'weight'],
        ['goal'],
        ['activityLevel'],
        [],
    ];

    const methods = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
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

    // Skip profile check on onboarding page - user is in middle of setup, profile won't exist yet
    useEffect(() => {
        if (!isLoading && profile) {
            navigate('/dashboard', { replace: true });
        }
    }, [profile, isLoading, navigate]);

    const goNext = async () => {
        const fields = STEP_FIELDS[currentStep];
        const valid = fields.length === 0 || await trigger(fields);
        if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const onSubmit = (data: OnboardingFormData) => {
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

    // Show loading while checking if profile exists
    if (isLoading) {
        return <div className={styles.root} />;
    }

    return (
        <FormProvider {...methods}>
            <div className={styles.root}>
                <div className={styles.languageSwitcher}>
                    <LanguageSwitcher />
                </div>

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

                <div className={styles.stepLabel}>
                    {t('onboarding.step', { current: currentStep + 1, total: STEPS.length })}
                </div>
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
                                ← {t('onboarding.back')}
                            </Button>
                        )}
                        {isLastStep ? (
                            <Button type="submit" loading={saveProfile.isPending}>
                                {t('onboarding.start')} →
                            </Button>
                        ) : (
                            <Button type="button" fullWidth={currentStep === 0} onClick={goNext}>
                                {t('onboarding.next')} →
                            </Button>
                        )}
                    </div>
                </form>

                {currentStep === 0 && (
                    <p className={styles.skipText}>
                        {t('onboarding.alreadySetUp')}{' '}
                        <button type="button" className={styles.skipLink} onClick={() => navigate('/dashboard')}>
                            {t('onboarding.skip')}
                        </button>
                    </p>
                )}
            </div>
        </FormProvider>
    );
};

export default BasicInfoPage;



