import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './calorie-donut.module.css';

interface CalorieDonutProps {
    consumed: number;
    target: number;
}

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

const CalorieDonut: React.FC<CalorieDonutProps> = ({ consumed, target }) => {
    const { t } = useTranslation();
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
                            className="donutArc"
                        />
                    </svg>
                    <div className={styles.donutLabel}>
                        <div className={styles.donutVal} style={{ color: strokeColor }}>
                            {Math.round(pct * 100)}%
                        </div>
                        <div className={styles.donutSub}>{t('dashboard.completed')}</div>
                    </div>
                </div>

                {/* Legend */}
                <div className={styles.legend}>
                    {[
                        { color: strokeColor, label: t('dashboard.consumed'), val: consumed.toLocaleString() + ' ' + t('common.kcal') },
                        { color: '#E1F5EE', label: t('dashboard.remaining'), val: remaining.toLocaleString() + ' ' + t('common.kcal') },
                        { color: '#5DCAA5', label: t('dashboard.target'), val: target.toLocaleString() + ' ' + t('common.kcal') },
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
                    ⚠ {t('dashboard.overWarning', { amount: (consumed - target).toLocaleString() })}
                </div>
            )}
        </div>
    );
};

export default CalorieDonut;

