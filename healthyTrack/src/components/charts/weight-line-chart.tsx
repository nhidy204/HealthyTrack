import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface DataPoint { date: string; weight: number }

interface WeightLineChartProps {
    data: DataPoint[];
}

const DAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const WeightLineChart: React.FC<WeightLineChartProps> = ({ data }) => {
    const formatted = data.map((d) => ({
        ...d,
        label: DAY_SHORT[new Date(d.date).getDay()],
    }));

    if (!data.length) return (
        <div style={{ padding: '2rem', textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Chưa có dữ liệu cân nặng tuần này.
        </div>
    );

    const weights = data.map(d => d.weight); //lấy ra 1 mảng chỉ chứa các con số cân nặng 
    const minY = Math.floor(Math.min(...weights) - 0.5); // tìm số nn, - 0.5 để tạo ko gian hở, rồi làm tròn xuống
    const maxY = Math.ceil(Math.max(...weights) + 0.5);

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[minY, maxY]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
                        borderRadius: 8, fontSize: 12,
                    }}
                    formatter={(val: number) => [`${val} kg`, 'Cân nặng']}
                    labelFormatter={(label) => label}
                />
                <Line
                    type="monotone" dataKey="weight"
                    stroke="#0f6e56" strokeWidth={2}
                    dot={{ r: 4, fill: '#0f6e56', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default WeightLineChart;
