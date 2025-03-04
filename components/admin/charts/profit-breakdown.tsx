// components/charts/profit-breakdown.tsx
'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomLegend } from './legend';
import { ChartLoading } from '@/components/admin/charts/chart-loading';
import { ErrorBoundary } from '@/components/admin/charts/error-boundary';
import { Suspense } from 'react';

const COLORS = ['rgb(var(--chart-primary))', 'rgb(var(--chart-secondary))', 'rgb(var(--chart-accent))'];

export const ProfitBreakdownChart = ({ data }: {
    data: { name: string; value: number }[]

}) => (

    <ErrorBoundary>
        <Suspense fallback={<ChartLoading />}>
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
                        nameKey="name"   // Connect names to the pie segments
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={[
                                    "rgb(155, 135, 245)",
                                    "rgb(101, 183, 243)",
                                    "rgb(76, 175, 147)",
                                ][index % 3]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <CustomLegend />
                </PieChart>
            </ResponsiveContainer>
        </Suspense>
    </ErrorBoundary>

);