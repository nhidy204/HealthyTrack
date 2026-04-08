import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { MealType } from '@typing/diary-types';
import { MEAL_META } from '@typing/diary-types';
import Input from '@ui/input';
import Button from '@ui/button';
import styles from './add-food-modal.module.css';

interface AddFoodForm {
    name: string;
    amount: string;
    calories: number;
}

interface AddFoodModalProps {
    mealType: MealType;
    date: string;
    onAdd: (data: AddFoodForm & { mealType: MealType; date: string }) => void;
    onClose: () => void; //gọi để đóng modal
    isLoading?: boolean; //trạng thái nút có đang xoay xoay chờ dữ liệu ko
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
    mealType, date, onAdd, onClose, isLoading,
}) => { // khởi tạo cc quản lý form (react-hook-form)
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors }, //danh sách lỗi nếu đối tượng nhập sai
    } = useForm<AddFoodForm>({ defaultValues: { amount: '1 phần' } });

    useEffect(() => {
        setFocus('name');
    }, [setFocus]);

    const onSubmit = (data: AddFoodForm) => { //gộp dl form
        onAdd({ ...data, mealType, date }); 
    };

    //chỉ chạy khi ko có lỗi
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {MEAL_META[mealType].icon} Thêm món — {MEAL_META[mealType].label}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose} type="button">✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label="Tên món ăn"
                        placeholder="VD: Cơm chiên trứng"
                        error={errors.name?.message}
                        {...register('name', { required: 'Vui lòng nhập tên món.' })}
                    />

                    <div className={styles.row}>
                        <Input
                            label="Khẩu phần"
                            placeholder="VD: 1 tô, 100g"
                            error={errors.amount?.message}
                            {...register('amount', { required: 'Nhập khẩu phần.' })}
                        />
                        <Input
                            label="Calo (kcal)"
                            type="number"
                            placeholder="350"
                            error={errors.calories?.message}
                            {...register('calories', {
                                required: 'Nhập lượng calo.',
                                min: { value: 0, message: 'Calo không âm.' },
                                max: { value: 9999, message: 'Calo quá lớn.' },
                                valueAsNumber: true,
                            })}
                        />
                    </div>

                    <div className={styles.btnRow}>
                        <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
                        <Button type="submit" loading={isLoading}>Thêm món</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFoodModal;