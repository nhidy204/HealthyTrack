import React, { useMemo } from 'react';
import styles from './password-strength.module.css';

interface PasswordStrengthProps {
    password: string;
}

type Level = { 
    label: string; 
    color: string; 
    width: string; 
    score: number 
};

function calcStrength(pw: string): Level {
    if (!pw) return { label: '', color: 'transparent', width: '0%', score: 0 };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++; 
    if (/[^A-Za-z0-9]/.test(pw)) score++; 

    const levels: Level[] = [
        { score: 1, label: 'Yếu', color: '#E24B4A', width: '25%' },
        { score: 2, label: 'Trung bình', color: '#EF9F27', width: '50%' },
        { score: 3, label: 'Khá mạnh', color: '#639922', width: '75%' },
        { score: 4, label: 'Rất mạnh', color: '#0f6e56', width: '100%' },
    ];

    return levels[Math.min(score - 1, 3)] ?? levels[0];
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
    const level = useMemo(() => calcStrength(password), [password]);

    if (!password) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.bar}>
                <div
                    className={styles.fill}
                    style={{ width: level.width, '--fill-color': level.color } as React.CSSProperties} // react.cssProperties để tránh lỗi khi dùng CSS variable trong inline style
                />
            </div>
            <span className={styles.label} style={{ color: level.color }}>
                {level.label}
            </span>
        </div>
    );
};

export default PasswordStrength;

