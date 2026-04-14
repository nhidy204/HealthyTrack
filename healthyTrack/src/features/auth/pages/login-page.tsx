import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import AuthLayout from '@shared/components/layout/auth-layout';
import Input from '@ui/input';
import Button from '@ui/button';
import { useLogin } from '@shared/hooks/use-auth.hook';
import { loginSchema, type LoginFormData } from '@auth/auth.schema';
import { useTranslation } from 'react-i18next';
import styles from './Auth.module.css';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const loginMutation = useLogin();

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <AuthLayout>
            <div className={styles.card}>
                <div className={styles.tabs}>
                    <span className={`${styles.tab} ${styles.activeTab}`}>{t('auth.login')}</span>
                    <Link to="/register" className={styles.tab}>{t('auth.register')}</Link>
                </div>

                <h1 className={styles.title}>{t('auth.welcomeBack')}</h1>
                <p className={styles.subtitle}>{t('auth.loginSubtitle')}</p>

                {loginMutation.isError && (
                    <div className={styles.alertError}>
                        {(loginMutation.error as Error)?.message ?? t('auth.loginFailed')}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label={t('auth.username')}
                        placeholder={t('auth.username')}
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register('username')}
                    />
                    <Input
                        label={t('auth.password')}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <div className={styles.forgotRow}>
                        <Link to="/forgot-password" className={styles.forgotLink}>
                            {t('auth.forgotPassword')}
                        </Link>
                    </div>
                    <Button type="submit" fullWidth loading={loginMutation.isPending}>
                        {t('auth.login')}
                    </Button>
                </form>

                <p className={styles.switchText}>
                    {t('auth.noAccount')}{' '}
                    <Link to="/register" className={styles.switchLink}>
                        {t('auth.createAccount')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;



