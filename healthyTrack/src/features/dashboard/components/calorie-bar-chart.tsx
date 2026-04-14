import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';

interface DataPoint { date: string; calories: number }

interface CalorieBarChartProps {
    data: DataPoint[];
    target: number;
}

const DAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const CalorieBarChart: React.FC<CalorieBarChartProps> = ({ data, target }) => {
    const formatted = data.map((d) => ({
        ...d, // giữ nguyên các thông tin cũ (date, calories)
        label: DAY_SHORT[new Date(d.date).getDay()], //trường label để hiện thị lên trục X
    }));

    if (!data.length) return (
        <div className="emptyState">
            Chưa có dữ liệu calo tuần này.
        </div>
    );

    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        background: 'var(--bg-secondary)', border: '0.5px solid var(--border-color)',
                        borderRadius: 8, fontSize: 12,
                    }}
                    formatter={(val: any) => {
                        if (typeof val === 'number') return [`${val.toLocaleString()} kcal`, 'Calo'];
                        return [`${val} kcal`, 'Calo'];
                    }}
                />
                {target > 0 && (
                    <ReferenceLine
                        y={target} stroke="#5DCAA5" strokeDasharray="4 3" strokeWidth={1.5}
                        label={{ value: `Mục tiêu ${target}`, position: 'insideTopRight', fontSize: 10, fill: '#0f6e56' }}
                    />
                )}
                <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                    {formatted.map((entry) => (
                        <Cell
                            key={entry.date}
                            fill={entry.calories > target ? '#E24B4A' : '#0f6e56'}
                            fillOpacity={0.85}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CalorieBarChart;

