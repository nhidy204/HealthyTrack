import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/auth-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { useLogin } from '../../hooks/use-auth';
import type { LoginForm } from '../../types/auth-types';
import { useTranslation } from 'react-i18next';
import styles from './Auth.module.css';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const loginMutation = useLogin();

    const onSubmit = (data: LoginForm) => {
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
                        {...register('username', {
                            required: t('validation.usernameRequired'),
                            minLength: { value: 3, message: t('validation.usernameMin') },
                        })}
                    />
                    <Input
                        label={t('auth.password')}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register('password', {
                            required: t('validation.passwordRequired'),
                        })}
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
