import React from 'react';
import { useTranslation } from 'react-i18next';
import { calcBMI, classifyBMI, type BMIClassification } from '@shared/utils/nutrition';
import styles from './stats-panel.module.css';

interface StatsPanelProps {
    weight: number;
    height: number;
    bmr: number;
    tdee: number;
}

const StatsPanelComponent: React.FC<StatsPanelProps> = ({ weight, height, bmr, tdee }) => {
    const { t } = useTranslation();

    const bmi = calcBMI(weight, height);
    const classification = classifyBMI(bmi);

    const getClassificationLabel = (classification: BMIClassification): string => {
        const labels: Record<BMIClassification, string> = {
            underweight: t('stats.bmi.underweight'),
            normal: t('stats.bmi.normal'),
            overweight: t('stats.bmi.overweight'),
            obese: t('stats.bmi.obese'),
        };
        return labels[classification];
    };

    const getClassificationColor = (classification: BMIClassification): string => {
        const colors: Record<BMIClassification, string> = {
            underweight: styles.underweight,
            normal: styles.normal,
            overweight: styles.overweight,
            obese: styles.obese,
        };
        return colors[classification];
    };

    return (
        <div className={styles.panel}>
            {/* BMI */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('stats.bmi.label')}</span>
                </div>
                <div className={styles.bmiValue}>{bmi.toFixed(1)}</div>
                <div className={`${styles.classification} ${getClassificationColor(classification)}`}>
                    {getClassificationLabel(classification)}
                </div>
                <div className={styles.bmiInfo}>
                    <small>{t('stats.bmi.info')}</small>
                </div>
            </div>

            {/* BMR */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('stats.bmr.label')}</span>
                </div>
                <div className={styles.metricValue}>{Math.round(bmr)}</div>
                <div className={styles.metricUnit}>{t('stats.bmr.unit')}</div>
                <div className={styles.metricInfo}>
                    <small>{t('stats.bmr.info')}</small>
                </div>
            </div>

            {/* TDEE*/}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{t('stats.tdee.label')}</span>
                </div>
                <div className={styles.metricValue}>{Math.round(tdee)}</div>
                <div className={styles.metricUnit}>{t('stats.tdee.unit')}</div>
                <div className={styles.metricInfo}>
                    <small>{t('stats.tdee.info')}</small>
                </div>
            </div>
        </div>
    );
};

export default StatsPanelComponent;


