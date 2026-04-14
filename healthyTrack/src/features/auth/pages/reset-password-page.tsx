import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '@shared/components/layout/auth-layout';
import Input from '@ui/input';
import Button from '@ui/button';
import PasswordStrength from '@ui/password-strength';
import { useResetPassword } from '@shared/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { resetPasswordSchema, type ResetPasswordFormData } from '@auth/auth.schema';
import styles from './Auth.module.css';

const ResetPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onBlur',
    });

    const resetMutation = useResetPassword();
    const password = watch('password', '');

    const onSubmit = (data: ResetPasswordFormData) => {
        resetMutation.mutate({ token, password: data.password });
    };

    if (!token) {
        return (
            <AuthLayout>
                <div className={styles.card}>
                    <div className={styles.alertError}>
                        {t('auth.linkExpired')}
                    </div>
                    <Link to="/forgot-password" className={styles.switchLink}>
                        {t('auth.requestNewLink')}
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className={styles.card}>
                <Link to="/login" className={styles.backLink}>
                    {t('auth.backToLogin')}
                </Link>

                <h1 className={styles.title}>{t('auth.resetPasswordTitle')}</h1>
                <p className={styles.subtitle}>
                    {t('auth.resetPasswordDesc')}
                </p>

                {resetMutation.isError && (
                    <div className={styles.alertError}>
                        {(resetMutation.error as Error)?.message ?? t('auth.generalError')}
                    </div>
                )}

                {resetMutation.isSuccess && (
                    <div className={styles.alertSuccess}>
                        {t('auth.passwordUpdated')}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div>
                        <Input
                            label={t('auth.newPassword')}
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <Input
                        label={t('auth.confirmNewPassword')}
                        type="password"
                        placeholder={t('auth.confirmNewPassword')}
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={resetMutation.isPending}
                        disabled={resetMutation.isSuccess}
                    >
                        {t('auth.password')}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordPage;


