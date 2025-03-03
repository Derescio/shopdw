// components/charts/revenue-trend.tsx
'use client';
import { Card } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { ChartLoading } from "./chart-loading";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";

interface RevenueTrendChartProps {
    data: Array<{
        name: string;
        value: number;
        users: number;
        sales: number;
    }>;
}
interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        payload: {
            name: string;
            users: number;
            sales: number;
        };
    }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background p-4 rounded-lg border border-primary shadow-lg">
                <p className="font-semibold">{payload[0].payload.name}</p>
                <p className="text-sm">Revenue: {formatCurrency(payload[0].value)}</p>
                <p className="text-sm">Users: {payload[0].payload.users}</p>
                <p className="text-sm">Sales: {payload[0].payload.sales}</p>
            </div>
        );
    }
    return null;
};

export const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => (

    <Suspense fallback={<ChartLoading />}>
        <Card className="p-6 h-full">
            <div className="mb-4">
                <h3 className="font-semibold">Revenue Trend</h3>
                <p className="text-sm text-muted-foreground">Monthly revenue progression</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="rgb(var(--chart-primary))"
                                stopOpacity={0.2}
                            />
                            <stop
                                offset="95%"
                                stopColor="rgb(var(--chart-primary))"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        stroke="rgb(var(--chart-primary))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="rgb(var(--chart-primary))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(var(--chart-primary), 0.1)"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(var(--chart-primary))"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    </Suspense>

);