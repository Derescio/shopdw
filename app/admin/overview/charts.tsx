'use client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Charts = ({ data: { salesData, skuProfits, result } }: {
    data: {
        salesData: { month: string, totalSales: number }[],
        skuProfits: { productId: string, profit: number }[],
        result: { totalRevenue: number, totalCost: number, profit: number }
    }
}) => {
    // Data for profit breakdown chart
    const profitData = [
        { name: 'Revenue', value: result.totalRevenue },
        { name: 'Cost', value: result.totalCost },
        { name: 'Profit', value: result.profit },
    ];

    // Data for product profits (truncate product IDs for display)
    const productProfitData = skuProfits.map(sp => ({
        name: sp.productId.slice(0, 6),
        profit: sp.profit,
    }));

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Existing Sales Chart */}
            <div className="h-[350px]">
                <h3 className="text-center mb-2 font-medium">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Bar dataKey="totalSales" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Profit Breakdown Chart */}
            <div className="h-[350px]">
                <h3 className="text-center mb-2 font-medium">Profit Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={profitData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {profitData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Product Profit Chart */}
            <div className="h-[350px]">
                <h3 className="text-center mb-2 font-medium">Product Profits</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productProfitData} layout="vertical">
                        <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                        <YAxis type="category" dataKey="name" />
                        <Bar dataKey="profit" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue vs Cost Chart */}
            <div className="h-[350px]">
                <h3 className="text-center mb-2 font-medium">Revenue vs Cost</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
                        <Line type="monotone" dataKey={(d) => d.totalSales * 0.2} stroke="#82ca9d" />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default Charts;