import React, { useCallback, useMemo } from 'react';
import { debounce } from '@utils/debounce';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthLayout from '@components/layout/auth-layout';
import Input from '@ui/input';
import Button from '@ui/button';
import PasswordStrength from '@ui/password-strength';
import { useRegister, useCheckUsername } from '@hooks/use-auth';
import { useTranslation } from 'react-i18next';
import type { RegisterForm } from '@typing/auth-types';
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
    } = useForm<RegisterForm>({ mode: 'onBlur' });

    const registerMutation = useRegister();
    const checkUsernameMutation = useCheckUsername();

    const password = watch('password', '');

    // kiểm tra tính khả dụng của name user
    const checkUsername = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.trim();
            if (val.length < 3) return;
            try {
                const res = await checkUsernameMutation.mutateAsync(val);
                if (!res.available) {
                    setError('username', {
                        type: 'manual',
                        message: t('auth.usernameTaken', { username: val }),
                    });
                } else {
                    clearErrors('username');
                }
            } catch {
                // network error — skip
            }
        },
        [checkUsernameMutation, setError, clearErrors, t]
    );

    const handleUsernameChange = useMemo(
        () => debounce(checkUsername, 500),
        [checkUsername]
    );

    const onSubmit = (data: RegisterForm) => {
        if (errors.username) return; // block if username taken
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...payload } = data;
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
                            required: t('validation.usernameRequired'),
                            minLength: { value: 3, message: t('validation.usernameMin') },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message: 'Chỉ dùng chữ, số và dấu gạch dưới.',
                            },
                            onChange: handleUsernameChange,
                        })}
                    />

                    <Input
                        label={t('auth.email')}
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register('email', {
                            required: t('validation.usernameRequired'),
                            pattern: {
                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                message: t('validation.emailInvalid'),
                            },
                        })}
                    />

                    <div>
                        <Input
                            label={t('auth.password')}
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password', {
                                required: t('validation.passwordRequired'),
                                minLength: {
                                    value: 8,
                                    message: 'Mật khẩu phải có ít nhất 8 ký tự',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                    message:
                                        'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt',
                                },
                            })}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <Input
                        label={t('auth.confirmPassword')}
                        type="password"
                        placeholder={t('auth.confirmPassword')}
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: t('validation.confirmPasswordRequired'),
                            validate: (val) => val === password || t('validation.passwordMismatch'),
                        })}
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
