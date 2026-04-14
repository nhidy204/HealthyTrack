import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
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
        <div className="emptyState">
            Chưa có dữ liệu cân nặng tuần này.
        </div>
    );

    const weights = data.map(d => d.weight);
    const minY = Math.floor(Math.min(...weights) - 0.5);
    const maxY = Math.ceil(Math.max(...weights) + 0.5);

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#999999' }} axisLine={false} tickLine={false} />
                <YAxis domain={[minY, maxY]} tick={{ fontSize: 11, fill: '#999999' }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        background: '#fff', border: '1px solid #e5e4e7',
                        borderRadius: 8, fontSize: 12,
                    }}
                    formatter={(value: string | number | ReadonlyArray<string | number> | undefined) => {
                        if (typeof value === 'number') {
                            return [`${value.toLocaleString()} kg`, 'Cân nặng'];
                        }
                        return ['-- kg', 'Cân nặng'];
                    }}
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

