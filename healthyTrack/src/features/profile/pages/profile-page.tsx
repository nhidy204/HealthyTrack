import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppLayout from '@shared/components/layout/app-layout';
import Input from '@ui/input';
import Button from '@ui/button';
import StatsPanel from '@dashboard/components/stats-panel';
import { useProfile } from '@shared/hooks/use-onboarding';
import { useUpdateUserProfile } from '@shared/hooks/use-profile';
import { useAuthStore } from '@auth/auth.store';
import { useThemeStore } from '@shared/store/theme-store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ACTIVITY_OPTIONS, GOAL_OPTIONS, type ActivityLevel } from '@onboarding/onboarding.types';
import { calcBMR, calcTDEE } from '@shared/utils/nutrition';
import { updateProfileSchema, type UpdateProfileFormData } from '@profile/profile.schema';
import { useNotificationStore } from '@shared/store/notification-store';
import { useWaterReminder } from '@shared/hooks/use-water-reminder';
import styles from './profile-page.module.css';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateUserProfile();
    const navigate = useNavigate();

    const getGoalLabel = (goal: string) => {
        const labelMap: Record<string, string> = {
            lose: 'onboarding.lose',
            gain: 'onboarding.gain',
            maintain: 'onboarding.maintain',
        };
        return t(labelMap[goal] || 'onboarding.maintain');
    };

    const getActivityLabel = (level: number) => {
        const labelMap: Record<number, string> = {
            1.2: 'onboarding.inActive',
            1.375: 'onboarding.light',
            1.55: 'onboarding.moderate',
            1.725: 'onboarding.active',
            1.9: 'onboarding.veryActive',
        };
        return t(labelMap[level] || 'onboarding.light');
    };

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        values: profile && user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: profile.gender,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal: profile.goal,
            activityLevel: typeof profile.activityLevel === 'string'
                ? Number(profile.activityLevel) as ActivityLevel
                : profile.activityLevel,
        } : undefined,
    });

    const onSubmit = (data: UpdateProfileFormData) => {
        updateProfile.mutate(data);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user
        ? (user.firstName[0] + user.lastName[0]).toUpperCase()
        : '?';

    const displayGoalLabel = profile ? getGoalLabel(profile.goal) : '';

    // Calculate BMR and TDEE cho panel
    const bmr = profile ? calcBMR({
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
    }) : 0;
    const tdee = profile ? calcTDEE(bmr, profile.activityLevel) : 0;

    const { waterReminderEnabled, setWaterReminder } = useNotificationStore();
    useWaterReminder(waterReminderEnabled);

    if (isLoading) {
        return <AppLayout title={t('profile.title')}><div className={styles.loading}>{t('common.loading')}</div></AppLayout>;
    }

    return (
        <AppLayout title={t('profile.title')}>
            <div className={styles.root}>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.formSection}>
                        <div className={styles.card}>
                            <div className={styles.profileHeader}>
                                <div className={styles.avatar}>{initials}</div>
                                <div>
                                    <div className={styles.profileName}>{user?.lastName} {user?.firstName}</div>
                                    <div className={styles.profileSub}>
                                        {t('profile.goal')} {displayGoalLabel} · {profile?.targetCalories?.toLocaleString()} {t('profile.targetCalories')}
                                    </div>
                                </div>
                            </div>

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
                                    {...register('lastName')} />
                                <Input label={t('auth.firstName')} error={errors.firstName?.message}
                                    {...register('firstName')} />
                                <Input label={t('auth.email')} type="email" error={errors.email?.message}
                                    {...register('email')} />
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
                                    {...register('age', { valueAsNumber: true })} />
                                <Input label={t('onboarding.height')} type="number" suffix={t('common.cm')} error={errors.height?.message}
                                    {...register('height', { valueAsNumber: true })} />
                                <Input label={t('onboarding.weight')} type="number" suffix={t('common.kg')} error={errors.weight?.message}
                                    {...register('weight', { valueAsNumber: true })} />
                            </div>

                            {/*goal*/}
                            <div className={styles.sectionTitle}>{t('profile.goalActivity')}</div>
                            <div className={styles.formGrid}>
                                <div>
                                    <label className={styles.selectLabel}>{t('onboarding.goal')}</label>
                                    <select className={styles.select} {...register('goal')}>
                                        {GOAL_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{getGoalLabel(option.value)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={styles.selectLabel}>{t('onboarding.activity')}</label>
                                    <select className={styles.select} {...register('activityLevel', { valueAsNumber: true })}>
                                        {ACTIVITY_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{getActivityLabel(option.value)}</option>
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
                                    <input type="checkbox" checked={isDark} onChange={toggleTheme} placeholder='toggle theme' />
                                    <span className={styles.toggleSlider} />
                                </label>
                            </div>

                            <div className={`${styles.toggleRow} ${styles.toggleRowLast}`}>
                                <div>
                                    <span className={styles.toggleLabel}>{t('profile.waterReminder')}</span>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={waterReminderEnabled}
                                        onChange={(e) => setWaterReminder(e.target.checked)}
                                        placeholder='toggle water'
                                    />
                                    <span className={styles.toggleSlider} />
                                </label>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardTitle}>{t('profile.account')}</div>
                            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                                {t('profile.logout')}
                            </button>
                        </div>
                    </form>

                    <aside className={styles.sidebarSection}>
                        {profile && (
                            <StatsPanel
                                weight={profile.weight}
                                height={profile.height}
                                bmr={Math.round(bmr)}
                                tdee={Math.round(tdee)}
                            />
                        )}
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProfilePage;



