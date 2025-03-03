'use client';
import { Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomLegend } from './legend';
import { ErrorBoundary } from './error-boundary';
import { Skeleton } from '@/components/ui/skeleton';

const ChartLoading = () => (
    <div className="h-[300px] space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-full w-full" />
    </div>
);

export const MonthlySalesChart = ({ data }: { data: { month: string; totalSales: number }[] }) => (
    <ErrorBoundary>
        <Suspense fallback={<ChartLoading />}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="month" stroke="rgb(var(--chart-primary))" />
                    <YAxis tickFormatter={(value) => `$${value}`} stroke="rgb(var(--chart-primary))" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'rgb(var(--chart-primary))',
                            borderRadius: '8px',
                        }}
                        formatter={(value) => [`$${value}`, 'Sales']}
                    />
                    <Bar
                        dataKey="totalSales"
                        fill="rgb(var(--chart-primary))"
                        radius={[4, 4, 0, 0]}
                    />
                    <CustomLegend />
                </BarChart>
            </ResponsiveContainer>
        </Suspense>
    </ErrorBoundary>
);