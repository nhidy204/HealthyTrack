import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/layout/auth-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { useForgotPassword } from '../../hooks/use-auth';
import type { ForgotPasswordForm } from '../../types/auth-types';
import styles from './Auth.module.css';

const ForgotPasswordPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordForm>();

    const forgotMutation = useForgotPassword();
    const [sent, setSent] = useState(false);

    const onSubmit = (data: ForgotPasswordForm) => {
        forgotMutation.mutate(data, {
            onSuccess: () => setSent(true),
        });
    };

    if (sent) {
        return (
            <AuthLayout>
                <div className={styles.card}>
                    <div className={styles.successIcon}>✉️</div>
                    <h1 className={styles.title}>Kiểm tra email của bạn</h1>
                    <p className={styles.subtitle}>
                        Chúng tôi đã gửi link đặt lại mật khẩu đến{' '}
                        <strong>{getValues('email')}</strong>.
                        Vui lòng kiểm tra hộp thư (kể cả thư mục spam).
                    </p>
                    <Link to="/login" className={styles.backLink}>
                        ← Quay lại đăng nhập
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

                <h1 className={styles.title}>Quên mật khẩu?</h1>
                <p className={styles.subtitle}>
                    Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.
                </p>

                {forgotMutation.isError && (
                    <div className={styles.alertError}>
                        {(forgotMutation.error as Error)?.message ?? 'Có lỗi xảy ra.'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

                    <Button type="submit" fullWidth loading={forgotMutation.isPending}>
                        Gửi link đặt lại
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
