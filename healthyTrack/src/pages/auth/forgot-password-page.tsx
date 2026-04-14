import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '@components/layout/auth-layout';
import Input from '@ui/input';
import Button from '@ui/button';
import { useForgotPassword } from '@hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@schemas/auth.schema';
import styles from './Auth.module.css';

const ForgotPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit, 
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
    }); 

    const forgotMutation = useForgotPassword();
    const [sent, setSent] = useState(false);

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotMutation.mutate(data, {
            onSuccess: () => setSent(true), //nếu spi trả về thành công --> cập nhật trạng thái sent sang true 
        });
    };

    if (sent) {
        return (
            //sent = true thành công thì hiện ra 
            <AuthLayout>
                <div className={styles.card}>
                    <div className={styles.successIcon}>✉️</div>
                    <h1 className={styles.title}>{t('auth.checkYourEmail')}</h1>
                    <p className={styles.subtitle}>
                        {t('auth.emailSent', { email: getValues('email') })}
                    </p>
                    <Link to="/login" className={styles.backLink}>
                        {t('auth.backToLogin')}
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        //sent = false thì hiện form nhập email
        <AuthLayout>
            <div className={styles.card}>
                <Link to="/login" className={styles.backLink}>
                    {t('auth.backToLogin')}
                </Link>

                <h1 className={styles.title}>{t('auth.forgotPasswordTitle')}</h1>
                <p className={styles.subtitle}>
                    {t('auth.forgotPasswordDesc')}
                </p>

                {forgotMutation.isError && (
                    <div className={styles.alertError}>
                        {(forgotMutation.error as Error)?.message ?? t('auth.generalError')}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label={t('auth.email')}
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Button type="submit" fullWidth loading={forgotMutation.isPending}>
                        {t('auth.sendResetLink')}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
