import React from 'react';
import { useForm } from 'react-hook-form';
import AppLayout from '../../components/layout/app-layout';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { useProfile } from '../../hooks/use-onboarding';
import { useUpdateUserProfile } from '../../hooks/use-profile';
import { useAuthStore } from '../../store/auth-store';
import { useThemeStore } from '../../store/theme-store';
import { useNavigate } from 'react-router-dom';
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from '../../types/onboarding-types';
import type { UpdateProfilePayload } from '../../types/profile-types';
import styles from './profile-page.module.css';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateUserProfile();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm<UpdateProfilePayload>({
        values: profile && user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: profile.gender,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal: profile.goal,
            activityLevel: profile.activityLevel,
        } : undefined,
    });

    const onSubmit = (data: UpdateProfilePayload) => {
        updateProfile.mutate(data);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user
        ? (user.firstName[0] + user.lastName[0]).toUpperCase()
        : '?';

    const goalLabel = profile?.goal === 'lose' ? 'Giảm cân'
        : profile?.goal === 'gain' ? 'Tăng cân' : 'Duy trì';

    if (isLoading) {
        return <AppLayout title="Hồ sơ"><div className={styles.loading}>Đang tải...</div></AppLayout>;
    }

    return (
        <AppLayout title="Hồ sơ cá nhân">
            <div className={styles.root}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.card}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatar}>{initials}</div>
                            <div>
                                <div className={styles.profileName}>{user?.lastName} {user?.firstName}</div>
                                <div className={styles.profileSub}>
                                    Mục tiêu: {goalLabel} · {profile?.targetCalories?.toLocaleString()} kcal/ngày
                                </div>
                            </div>
                        </div>

                        {/* success / error messages */}
                        {updateProfile.isSuccess && (
                            <div className={styles.alertSuccess}>✓ Đã lưu thông tin thành công!</div>
                        )}
                        {updateProfile.isError && (
                            <div className={styles.alertError}>
                                {(updateProfile.error as Error)?.message ?? 'Có lỗi xảy ra.'}
                            </div>
                        )}

                        <div className={styles.sectionTitle}>Thông tin cá nhân</div>
                        <div className={styles.formGrid}>
                            <Input label="Họ" error={errors.lastName?.message}
                                {...register('lastName', { required: 'Nhập họ.' })} />
                            <Input label="Tên" error={errors.firstName?.message}
                                {...register('firstName', { required: 'Nhập tên.' })} />
                            <Input label="Email" type="email" error={errors.email?.message}
                                {...register('email', {
                                    required: 'Nhập email.',
                                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Email không hợp lệ.' },
                                })} />
                            <div>
                                <label className={styles.selectLabel}>Giới tính</label>
                                <select className={styles.select} {...register('gender')}>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.sectionTitle}>Chỉ số cơ thể</div>
                        <div className={styles.formGrid}>
                            <Input label="Tuổi" type="number" suffix="tuổi" error={errors.age?.message}
                                {...register('age', { required: true, min: 10, max: 100, valueAsNumber: true })} />
                            <Input label="Chiều cao" type="number" suffix="cm" error={errors.height?.message}
                                {...register('height', { required: true, min: 100, max: 250, valueAsNumber: true })} />
                            <Input label="Cân nặng" type="number" suffix="kg" error={errors.weight?.message}
                                {...register('weight', { required: true, min: 20, max: 300, valueAsNumber: true })} />
                        </div>

                        {/*goal*/}
                        <div className={styles.sectionTitle}>Mục tiêu & Vận động</div>
                        <div className={styles.formGrid}>
                            <div>
                                <label className={styles.selectLabel}>Mục tiêu</label>
                                <select className={styles.select} {...register('goal')}>
                                    {GOAL_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={styles.selectLabel}>Mức độ vận động</label>
                                <select className={styles.select} {...register('activityLevel', { valueAsNumber: true })}>
                                    {ACTIVITY_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.btnRow}>
                            <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardTitle}>Cài đặt</div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleLabel}>Chế độ tối</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                                <span className={styles.toggleSlider} />
                            </label>
                        </div>

                        <div className={styles.toggleRow} style={{ borderBottom: 'none' }}>
                            <span className={styles.toggleLabel}>Nhắc nhở uống nước (mỗi 2 giờ)</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.toggleSlider} />
                            </label>
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>Tài khoản</div>
                        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default ProfilePage;
