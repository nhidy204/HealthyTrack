import React from 'react';
import styles from './calorie-donut.module.css';

interface CalorieDonutProps {
    consumed: number;
    target: number;
}

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

const CalorieDonut: React.FC<CalorieDonutProps> = ({ consumed, target }) => {
    const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
    const offset = CIRC * (1 - pct);
    //   const offset = isNaN(pct) ? CIRC : CIRC * (1 - pct);
    const isOver = consumed > target;
    const remaining = Math.max(0, target - consumed);
    const strokeColor = isOver ? '#E24B4A' : '#0f6e56';

    return (
        <div className={styles.wrap}>
            <div className={styles.donutWrap}>
                {/* SVG donut */}
                <div className={styles.donutCenter}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="#E1F5EE" strokeWidth="18" />
                        <circle
                            cx="70" cy="70" r={RADIUS}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="18"
                            strokeDasharray={CIRC} 
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            transform="rotate(-90 70 70)"
                            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s' }}
                        />
                    </svg>
                    <div className={styles.donutLabel}>
                        <div className={styles.donutVal} style={{ color: strokeColor }}>
                            {Math.round(pct * 100)}%
                        </div>
                        <div className={styles.donutSub}>hoàn thành</div>
                    </div>
                </div>

                {/* Legend */}
                <div className={styles.legend}>
                    {[
                        { color: strokeColor, label: 'Đã nạp', val: consumed.toLocaleString() + ' kcal' },
                        { color: '#E1F5EE', label: 'Còn lại', val: remaining.toLocaleString() + ' kcal' },
                        { color: '#5DCAA5', label: 'Mục tiêu', val: target.toLocaleString() + ' kcal' },
                    ].map((item) => (
                        <div key={item.label} className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: item.color }} />
                            <span className={styles.legendName}>{item.label}</span>
                            <span className={styles.legendVal}>{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Over-target warning */}
            {isOver && (
                <div className={styles.warningBanner}>
                    ⚠ Bạn đã vượt mục tiêu {(consumed - target).toLocaleString()} kcal hôm nay!
                </div>
            )}
        </div>
    );
};

export default CalorieDonut;
