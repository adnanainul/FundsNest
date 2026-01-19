import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RiskGraph = ({ portfolio }) => {
    if (!portfolio || portfolio.length === 0) return <p className="text-xs text-gray-400">No portfolio data</p>;

    const data = [
        { name: 'Low Risk', value: portfolio.filter(p => p.riskCategory === 'Low').length, color: '#10B981' },
        { name: 'Medium Risk', value: portfolio.filter(p => p.riskCategory === 'Medium').length, color: '#F59E0B' },
        { name: 'High Risk', value: portfolio.filter(p => p.riskCategory === 'High').length, color: '#EF4444' },
    ].filter(d => d.value > 0);

    return (
        <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-2 text-[10px] text-gray-500">
                {data.map(d => (
                    <span key={d.name} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                        {d.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RiskGraph;
