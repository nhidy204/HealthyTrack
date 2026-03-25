import React from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/auth-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import PasswordStrength from '../../components/ui/password-strength';
import { useResetPassword } from '../../hooks/use-auth';
import type { ResetPasswordForm } from '../../types/auth-types';
import styles from './Auth.module.css';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>();

    const resetMutation = useResetPassword();
    const password = watch('password', '');

    const onSubmit = (data: ResetPasswordForm) => {
        resetMutation.mutate({ token, password: data.password });
    };

    if (!token) {
        return (
            <AuthLayout>
                <div className={styles.card}>
                    <div className={styles.alertError}>
                        Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                    </div>
                    <Link to="/forgot-password" className={styles.switchLink}>
                        Yêu cầu link mới
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className={styles.card}>
                <Link to="/login" className={styles.backLink}>
                    ← Quay lại đăng nhập
                </Link>

                <h1 className={styles.title}>Đặt mật khẩu mới</h1>
                <p className={styles.subtitle}>
                    Nhập mật khẩu mới cho tài khoản của bạn.
                </p>

                {resetMutation.isError && (
                    <div className={styles.alertError}>
                        {(resetMutation.error as Error)?.message ?? 'Có lỗi xảy ra.'}
                    </div>
                )}

                {resetMutation.isSuccess && (
                    <div className={styles.alertSuccess}>
                        ✓ Mật khẩu đã được cập nhật. Đang chuyển sang đăng nhập...
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div>
                        <Input
                            label="Mật khẩu mới"
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'Vui lòng nhập mật khẩu mới.',
                                minLength: { value: 8, message: 'Mật khẩu cần ít nhất 8 ký tự.' },
                            })}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <Input
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
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
                        loading={resetMutation.isPending}
                        disabled={resetMutation.isSuccess}
                    >
                        Cập nhật mật khẩu
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
