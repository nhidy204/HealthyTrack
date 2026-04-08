import React, { useState } from 'react';
import { useLogWeight, useWeightHistory } from '@hooks/use-dashboard';
import { useTranslation } from 'react-i18next';
import type { WeightLog } from '@typing/dashboard-types';
import styles from './weight-card.module.css';

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function dayLabel(isoDate: string) {
    return DAY_LABELS[new Date(isoDate).getDay()];
}

const WeightCard: React.FC = () => {
    const { t } = useTranslation();
    const [inputVal, setInputVal] = useState('');
    const { data: history = [] } = useWeightHistory(7);
    const logWeight = useLogWeight();

    const handleSave = () => {
        const w = parseFloat(inputVal);
        if (isNaN(w) || w < 20 || w > 300) return;
        logWeight.mutate({ weight: w });
        setInputVal('');
    };

    // compute bar heights
    const weights = history.map((h) => h.weight);
    const minW = weights.length ? Math.min(...weights) - 0.5 : 0;
    const maxW = weights.length ? Math.max(...weights) + 0.5 : 1;

    const barHeight = (w: number) =>
        Math.round(((w - minW) / (maxW - minW)) * 40 + 8);

    return (
        <div>
            {/* Input row */}
            <div className={styles.inputRow}>
                <div className={styles.inputWrap}>
                    <div className={styles.inputLabel}>{t('components.dailyWeight')}</div>
                    <input
                        type="number"
                        className={styles.input}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="68.5"
                        min={20}
                        max={300}
                        step={0.1}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                </div>
                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={logWeight.isPending}
                >
                    {logWeight.isPending ? '...' : t('components.save')}
                </button>
            </div>

            {logWeight.isSuccess && (
                <p className={styles.successMsg}>{t('components.saved')}</p>
            )}

            {/* Mini bar chart */}
            {history.length > 0 && (
                <div className={styles.chart}>
                    <div className={styles.chartLabel}>{t('components.lastDays')}</div>
                    <div className={styles.bars}>
                        {history.map((log: WeightLog, i) => (
                            <div key={log.date} className={styles.barCol}>
                                <div className={styles.barWrap} title={`${log.weight} kg`}>
                                    <div
                                        className={`${styles.bar} ${i === history.length - 1 ? styles.barCurrent : ''}`}
                                        style={{ height: barHeight(log.weight) + 'px' }}
                                    />
                                </div>
                                <div className={styles.barDate}>{dayLabel(log.date)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeightCard;
