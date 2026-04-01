import React from 'react';
import { useForm } from 'react-hook-form';
import AppLayout from '../../components/layout/app-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { useProfile } from '../../hooks/use-onboarding';
import { useUpdateUserProfile } from '../../hooks/use-profile';
import { useAuthStore } from '../../store/auth-store';
import { useThemeStore } from '../../store/theme-store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from '../../types/onboarding-types';
import type { UpdateProfilePayload } from '../../types/profile-types';
import styles from './profile-page.module.css';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateUserProfile();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm<UpdateProfilePayload>({
        values: profile && user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: profile.gender,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal: profile.goal,
            activityLevel: profile.activityLevel,
        } : undefined,
    });

    const onSubmit = (data: UpdateProfilePayload) => {
        updateProfile.mutate(data);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user
        ? (user.firstName[0] + user.lastName[0]).toUpperCase()
        : '?';

    const goalLabel = profile?.goal === 'lose' ? t('onboarding.lose')
        : profile?.goal === 'gain' ? t('onboarding.gain') : t('onboarding.maintain');

    if (isLoading) {
        return <AppLayout title={t('profile.title')}><div className={styles.loading}>{t('common.loading')}</div></AppLayout>;
    }

    return (
        <AppLayout title={t('profile.title')}>
            <div className={styles.root}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.card}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatar}>{initials}</div>
                            <div>
                                <div className={styles.profileName}>{user?.lastName} {user?.firstName}</div>
                                <div className={styles.profileSub}>
                                    {t('profile.goal')} {goalLabel} · {profile?.targetCalories?.toLocaleString()} {t('profile.targetCalories')}
                                </div>
                            </div>
                        </div>

                        {/* success / error messages */}
                        {updateProfile.isSuccess && (
                            <div className={styles.alertSuccess}>✓ {t('profile.saveSuccess')}</div>
                        )}
                        {updateProfile.isError && (
                            <div className={styles.alertError}>
                                {(updateProfile.error as Error)?.message ?? t('auth.generalError')}
                            </div>
                        )}

                        <div className={styles.sectionTitle}>{t('profile.personalInfo')}</div>
                        <div className={styles.formGrid}>
                            <Input label={t('auth.lastName')} error={errors.lastName?.message}
                                {...register('lastName', { required: t('validation.lastNameRequired') })} />
                            <Input label={t('auth.firstName')} error={errors.firstName?.message}
                                {...register('firstName', { required: t('validation.firstNameRequired') })} />
                            <Input label={t('auth.email')} type="email" error={errors.email?.message}
                                {...register('email', {
                                    required: t('validation.usernameRequired'),
                                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: t('validation.emailInvalid') },
                                })} />
                            <div>
                                <label className={styles.selectLabel}>{t('onboarding.gender')}</label>
                                <select className={styles.select} {...register('gender')}>
                                    <option value="male">{t('onboarding.male')}</option>
                                    <option value="female">{t('onboarding.female')}</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.sectionTitle}>{t('profile.bodyMetrics')}</div>
                        <div className={styles.formGrid}>
                            <Input label={t('onboarding.age')} type="number" suffix={t('common.years')} error={errors.age?.message}
                                {...register('age', { required: true, min: 10, max: 100, valueAsNumber: true })} />
                            <Input label={t('onboarding.height')} type="number" suffix={t('common.cm')} error={errors.height?.message}
                                {...register('height', { required: true, min: 100, max: 250, valueAsNumber: true })} />
                            <Input label={t('onboarding.weight')} type="number" suffix={t('common.kg')} error={errors.weight?.message}
                                {...register('weight', { required: true, min: 20, max: 300, valueAsNumber: true })} />
                        </div>

                        {/*goal*/}
                        <div className={styles.sectionTitle}>{t('profile.goalActivity')}</div>
                        <div className={styles.formGrid}>
                            <div>
                                <label className={styles.selectLabel}>{t('onboarding.goal')}</label>
                                <select className={styles.select} {...register('goal')}>
                                    {GOAL_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={styles.selectLabel}>{t('onboarding.activity')}</label>
                                <select className={styles.select} {...register('activityLevel', { valueAsNumber: true })}>
                                    {ACTIVITY_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.btnRow}>
                            <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
                                {t('profile.saveChanges')}
                            </Button>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardTitle}>{t('profile.settings')}</div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleLabel}>{t('profile.darkMode')}</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                                <span className={styles.toggleSlider} />
                            </label>
                        </div>

                        <div className={styles.toggleRow} style={{ borderBottom: 'none' }}>
                            <span className={styles.toggleLabel}>{t('profile.waterReminder')}</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.toggleSlider} />
                            </label>
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>{t('profile.account')}</div>
                        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                            {t('profile.logout')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default ProfilePage;
