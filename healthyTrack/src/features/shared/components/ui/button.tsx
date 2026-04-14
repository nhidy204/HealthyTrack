import React from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean; //trạng thái chờ -> true thì hiện vòng xoay
    variant?: 'primary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
    loading,
    variant = 'primary',
    fullWidth = false,
    children,
    disabled,
    className,
    ...props //gom tất cả các thuộc tính HTML còn lại vào biến 'props'
}) => {
    return (
        <button
            className={[
                styles.btn,
                styles[variant],
                fullWidth ? styles.fullWidth : '',
                loading ? styles.loading : '',
                className ?? '',
            ].join(' ')}
            disabled={disabled ?? loading}
            {...props}
        >
            {loading ? (
                <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            <span className={loading ? styles.hiddenText : ''}>{children}</span>
        </button>
    );
};

export default Button;

