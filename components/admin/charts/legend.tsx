// components/charts/legend.tsx
'use client';
import { LegendProps } from 'recharts';

export const CustomLegend = ({ payload }: LegendProps) => {
    if (!payload) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-4">
            {payload.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-foreground">
                        {entry.value} ({entry?.payload})
                    </span>
                </div>
            ))}
        </div>
    );
};