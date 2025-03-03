'use client';
import { Skeleton } from "@/components/ui/skeleton";

export const ChartLoading = () => (
    <div className="h-[300px] space-y-2 p-4">
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-full w-full" />
    </div>
);