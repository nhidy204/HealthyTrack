import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { debounce } from '@utils/debounce';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import AuthLayout from '@components/layout/auth-layout';
import Input from '@ui/input';
import Button from '@ui/button';
import PasswordStrength from '@ui/password-strength';
import { useRegister, useCheckUsername } from '@hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { registerSchema, type RegisterFormData } from '@schemas/auth.schema';
import styles from './auth.module.css';

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const registerMutation = useRegister();
    const checkUsernameMutation = useCheckUsername();

    const password = watch('password', '');

    // tránh race condition
    const lastCheckedUsername = useRef<string>('');

    const checkUsername = useCallback(
        async (username: string) => {
            const val = username.trim();

            if (val.length < 3) return;

            lastCheckedUsername.current = val;

            try {
                const res = await checkUsernameMutation.mutateAsync(val);

                // chỉ xử lý nếu request mới nhất
                if (lastCheckedUsername.current !== val) return;

                if (!res.available) {
                    setError('username', {
                        type: 'manual',
                        message: t('auth.usernameTaken', { username: val }),
                    });
                } else {
                    clearErrors('username');
                }
            } catch {
                // ignore network error
            }
        },
        [checkUsernameMutation, setError, clearErrors, t]
    );

    const handleUsernameChange = useMemo(
        () => debounce(checkUsername, 500),
        [checkUsername]
    );

    // cleanup debounce khi unmount
    useEffect(() => {
        return () => {
            handleUsernameChange.cancel();
        };
    }, [handleUsernameChange]);

    const onSubmit = (data: RegisterFormData) => {
        if (errors.username) return;

        const { confirmPassword, ...payload } = data;
        void confirmPassword;
        registerMutation.mutate(payload);
    };

    return (
        <AuthLayout>
            <div className={styles.card}>
                {/* Tab header */}
                <div className={styles.tabs}>
                    <Link to="/login" className={styles.tab}>{t('auth.login')}</Link>
                    <span className={`${styles.tab} ${styles.activeTab}`}>{t('auth.register')}</span>
                </div>

                <h1 className={styles.title}>{t('auth.createNewAccount')}</h1>
                <p className={styles.subtitle}>
                    {t('auth.startJourney')}
                </p>

                {registerMutation.isError && (
                    <div className={styles.alertError}>
                        {(registerMutation.error as Error)?.message ?? t('auth.loginFailed')}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.row}>
                        <Input
                            label={t('auth.lastName')}
                            placeholder={t('auth.lastName')}
                            error={errors.lastName?.message}
                            {...register('lastName', { required: t('validation.lastNameRequired') })}
                        />
                        <Input
                            label={t('auth.firstName')}
                            placeholder={t('auth.firstName')}
                            error={errors.firstName?.message}
                            {...register('firstName', { required: t('validation.firstNameRequired') })}
                        />
                    </div>

                    <Input
                        label={t('auth.username')}
                        placeholder={t('auth.username')}
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register('username', {
                            onChange: (e) =>
                                handleUsernameChange(e.target.value),
                        })}
                    />

                    <Input
                        label={t('auth.email')}
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <div>
                        <Input
                            label={t('auth.password')}
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <Input
                        label={t('auth.confirmPassword')}
                        type="password"
                        placeholder={t('auth.confirmPassword')}
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={registerMutation.isPending}
                    >
                        {t('auth.createAccount')}
                    </Button>
                </form>

                <p className={styles.switchText}>
                    {t('auth.hasAccount')}{' '}
                    <Link to="/login" className={styles.switchLink}>
                        {t('auth.loginNow')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;