"use client";

import {
    Bar,
    BarChart,
    type ChartConfig,
    XAxis,
    YAxis,
} from "@/components/dither-kit";
import { cn } from "@/lib/utils";

export type CountBarDatum = {
    label: string;
    count: number;
};

const config = {
    count: {
        label: "Count",
        color: "blue",
    },
} satisfies ChartConfig;

type CountBarProps = {
    data: CountBarDatum[];
    countLabel: string;
    className?: string;
};

export function CountBar({
    data,
    countLabel,
    className,
}: CountBarProps) {
    if (data.length === 0) {
        return null;
    }

    const chartConfig: ChartConfig = {
        count: {
            label: countLabel,
            color: config.count.color,
        },
    };

    return (
        <div className={cn("h-56 w-full", className)}>
            <BarChart
                data={data}
                config={chartConfig}
                margins={{
                    top: 8,
                    right: 8,
                    bottom: 24,
                    left: 28,
                }}
            >
                <YAxis tickCount={4} />
                <XAxis dataKey="label" />
                <Bar dataKey="count" />
            </BarChart>
        </div>
    );
}