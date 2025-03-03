'use client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const productName = [
    { name: 'Tommy Hilfiger Classic Fit Dress Shirt', id: '70a624bb-8517-4284-9e1a-e9a68f88073e' },
    { name: 'Polo Sporting Stretch Shirt', id: 'bc137866-5ff0-4ccb-bdff-d1b842ed2df6' },
    { name: 'Polo Ralph Lauren Oxford Shirt', id: 'bec11a3f-874e-4642-91bf-769de30104b5' },
    { name: 'Polo Classic Pink Hoodie', id: 'f06c775f-4d00-4778-8c13-75f0f3d07574' },
    { name: 'Calvin Klein Slim Fit Stretch Shirt', id: 'f5630864-8d77-4a71-98a9-0640aa0bb21d' },
    { name: 'Brooks Brothers Long Sleeved Shirt', id: 'f62f142b-0988-405c-8900-4205c33cc91c' },
];

// Color palette for products
const COLORS = [
    '#8884d8', // Purple
    '#82ca9d', // Green
    '#ffc658', // Orange
    '#ff8042', // Red-Orange
    '#0088fe', // Blue
    '#00c49f'  // Teal
];

// Create color map based on product IDs
const colorMap = productName.reduce((acc, product, index) => {
    acc[product.id] = COLORS[index % COLORS.length];
    return acc;
}, {} as Record<string, string>);

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        payload: {
            fullName: string;
        };
    }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background p-4 rounded-lg border border-primary shadow-lg">
                <p className="font-semibold">{payload[0].payload.fullName}</p>
                <p className="text-sm">Profit: {formatCurrency(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

export const ProductProfitChart = ({ data }: {
    data: { productId: string; profit: number }[]
}) => {
    const chartData = data.map(item => {
        const product = productName.find(p => p.id === item.productId);
        return {
            name: `Product ${item.productId.slice(-4)}`,
            fullName: product ? product.name : 'Unknown Product',
            profit: item.profit,
            productId: item.productId // Include productId for color mapping
        };
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(136, 136, 136, 0.1)' }}
                />
                <Bar
                    dataKey="profit"
                    radius={[4, 4, 0, 0]}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={colorMap[entry.productId]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
}