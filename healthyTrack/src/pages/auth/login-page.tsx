import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/auth-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { useLogin } from '../../hooks/use-auth';
import type { LoginForm } from '../../types/auth-types';
import styles from './Auth.module.css';

const LoginPage: React.FC = () => {
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
                {/* Tab header */}
                <div className={styles.tabs}>
                    <span className={`${styles.tab} ${styles.activeTab}`}>Đăng nhập</span>
                    <Link to="/register" className={styles.tab}>Đăng ký</Link>
                </div>

                <h1 className={styles.title}>Chào mừng trở lại</h1>
                <p className={styles.subtitle}>
                    Đăng nhập để tiếp tục hành trình sức khỏe của bạn.
                </p>

                {/* API error */}
                {loginMutation.isError && (
                    <div className={styles.alertError}>
                        {(loginMutation.error as Error)?.message ?? 'Đăng nhập thất bại.'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label="Tên đăng nhập"
                        placeholder="Nhập username"
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register('username', {
                            required: 'Vui lòng nhập tên đăng nhập.',
                            minLength: { value: 3, message: 'Username tối thiểu 3 ký tự.' },
                        })}
                    />

                    <Input
                        label="Mật khẩu"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register('password', {
                            required: 'Vui lòng nhập mật khẩu.',
                        })}
                    />

                    <div className={styles.forgotRow}>
                        <Link to="/forgot-password" className={styles.forgotLink}>
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        loading={loginMutation.isPending}
                    >
                        Đăng nhập
                    </Button>
                </form>

                <p className={styles.switchText}>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className={styles.switchLink}>
                        Tạo tài khoản mới
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
