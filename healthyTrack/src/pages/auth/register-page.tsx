import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/auth-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import PasswordStrength from '../../components/ui/password-strength';
import { useRegister, useCheckUsername } from '../../hooks/use-auth';
import type { RegisterForm } from '../../types/auth-types';
import styles from './Auth.module.css';

const RegisterPage: React.FC = () => {
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
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const password = watch('password', '');

    // kiểm tra tính khả dụng của name user
    const handleUsernameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.trim();
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (val.length < 3) return;

            debounceRef.current = setTimeout(async () => {
                try {
                    const res = await checkUsernameMutation.mutateAsync(val);
                    if (!res.available) {
                        setError('username', {
                            type: 'manual',
                            message: `Username "${val}" đã tồn tại, vui lòng chọn username khác.`,
                        });
                    } else {
                        clearErrors('username');
                    }
                } catch {
                    // network error — skip check silently
                }
            }, 500);
        },
        [checkUsernameMutation, setError, clearErrors]
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
                    <Link to="/login" className={styles.tab}>Đăng nhập</Link>
                    <span className={`${styles.tab} ${styles.activeTab}`}>Đăng ký</span>
                </div>

                <h1 className={styles.title}>Tạo tài khoản</h1>
                <p className={styles.subtitle}>
                    Bắt đầu hành trình sức khỏe của bạn hôm nay.
                </p>

                {registerMutation.isError && (
                    <div className={styles.alertError}>
                        {(registerMutation.error as Error)?.message ?? 'Đăng ký thất bại.'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.row}>
                        <Input
                            label="Họ"
                            placeholder="Nguyễn"
                            error={errors.lastName?.message}
                            {...register('lastName', { required: 'Nhập họ của bạn.' })}
                        />
                        <Input
                            label="Tên"
                            placeholder="Văn A"
                            error={errors.firstName?.message}
                            {...register('firstName', { required: 'Nhập tên của bạn.' })}
                        />
                    </div>

                    <Input
                        label="Tên đăng nhập"
                        placeholder="username duy nhất"
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register('username', {
                            required: 'Vui lòng nhập tên đăng nhập.',
                            minLength: { value: 3, message: 'Username tối thiểu 3 ký tự.' },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message: 'Chỉ dùng chữ, số và dấu gạch dưới.',
                            },
                            onChange: handleUsernameChange,
                        })}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register('email', {
                            required: 'Vui lòng nhập email.',
                            pattern: {
                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                message: 'Email không hợp lệ.',
                            },
                        })}
                    />

                    <div>
                        <Input
                            label="Mật khẩu"
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'Vui lòng nhập mật khẩu.',
                                minLength: { value: 8, message: 'Mật khẩu cần ít nhất 8 ký tự.' },
                            })}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <Input
                        label="Xác nhận mật khẩu"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Vui lòng xác nhận mật khẩu.',
                            validate: (val) => val === password || 'Mật khẩu không khớp.',
                        })}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={registerMutation.isPending}
                    >
                        Tạo tài khoản
                    </Button>
                </form>

                <p className={styles.switchText}>
                    Đã có tài khoản?{' '}
                    <Link to="/login" className={styles.switchLink}>
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
