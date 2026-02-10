import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryColor, CATEGORIES } from '../../utils/categories';
import './Analytics.css';

export const Analytics = ({ subscriptions }) => {
    // Aggregate by category
    const data = CATEGORIES.map(cat => {
        const total = subscriptions
            .filter(sub => (sub.category || 'general') === cat.id)
            .reduce((sum, sub) => sum + sub.price, 0);
        return {
            name: cat.label,
            value: total,
            color: cat.color
        };
    }).filter(d => d.value > 0);

    const totalSpent = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="analytics-container">
            <div className="analytics-card glass">
                <h3>Ripartizione Spese</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#111827', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => `€${value.toFixed(2)}`}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="center-label">
                        <span className="total-label">Totale</span>
                        <span className="total-value">€{totalSpent.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <div className="category-list">
                <h3>Dettaglio</h3>
                {data.sort((a, b) => b.value - a.value).map(item => (
                    <div key={item.name} className="cat-row">
                        <div className="cat-info">
                            <div className="cat-dot" style={{ background: item.color }}></div>
                            <span>{item.name}</span>
                        </div>
                        <span className="cat-amount">€{item.value.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
