import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MealType } from '@typing/diary-types';
import { MEAL_META } from '@typing/diary-types';
import { addFoodModalSchema, type AddFoodModalFormData } from '@schemas/diary.schema';
import Input from '@ui/input';
import Button from '@ui/button';
import styles from './add-food-modal.module.css';

interface AddFoodModalProps {
    mealType: MealType;
    date: string;
    onAdd: (data: AddFoodModalFormData & { mealType: MealType; date: string }) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
    mealType, date, onAdd, onClose, isLoading,
}) => {
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors, isSubmitting, isValid },
    } = useForm<AddFoodModalFormData>({
        resolver: zodResolver(addFoodModalSchema),
        mode: 'onChange',
        defaultValues: { 
            name: '',
            amount: '1 phần',
            calories: 0,
        },
    });

    useEffect(() => {
        setFocus('name');
    }, [setFocus]);

    const onSubmit = (data: AddFoodModalFormData) => {
        console.log('Form data:', data);
        onAdd({ ...data, mealType, date });
    };

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
                        {...register('name')}
                    />

                    <div className={styles.row}>
                        <Input
                            label="Khẩu phần"
                            placeholder="VD: 1 tô, 100g"
                            error={errors.amount?.message}
                            {...register('amount')}
                        />
                        <Input
                            label="Calo (kcal)"
                            type="number"
                            placeholder="350"
                            error={errors.calories?.message}
                            {...register('calories', { valueAsNumber: true })}
                        />
                    </div>

                    <div className={styles.btnRow}>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose} 
                            disabled={isSubmitting || isLoading}
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            loading={isSubmitting || isLoading}
                            disabled={isSubmitting || isLoading}
                        >
                            Thêm món
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFoodModal;