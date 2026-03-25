import React from 'react';
import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className={styles.group}>
                <label className={styles.label}>{label}</label>
                <input
                    ref={ref}
                    className={`${styles.input} ${error ? styles.error : ''} ${className ?? ''}`}
                    {...props}
                />
                {error && <p className={styles.errorMsg}>{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
