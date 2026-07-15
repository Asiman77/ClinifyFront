import { cn } from "@/lib/utils";

export type CountBarDatum = {
    label: string;
    count: number;
};

type CountBarProps = {
    data: CountBarDatum[];
    countLabel: string;
    emptyMessage?: string;
    className?: string;
};

export function CountBar({
    data,
    countLabel,
    emptyMessage = "No data available",
    className,
}: CountBarProps) {
    const visibleData = data.filter(
        (item) => item.count > 0,
    );

    const maximumCount = Math.max(
        ...visibleData.map((item) => item.count),
        1,
    );

    if (visibleData.length === 0) {
        return (
            <p className="py-8 text-sm text-muted-foreground">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div
            className={cn("flex flex-col gap-4", className)}
            role="img"
            aria-label={`${countLabel} distribution`}
        >
            {visibleData.map((item) => {
                const width =
                    (item.count / maximumCount) * 100;

                return (
                    <div
                        key={item.label}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="min-w-0 truncate font-medium">
                                {item.label}
                            </span>

                            <span className="shrink-0 font-mono text-muted-foreground tabular-nums">
                                {item.count}
                                <span className="sr-only">
                                    {" "}
                                    {countLabel}
                                </span>
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-sm bg-muted">
                            <div
                                className="h-full rounded-sm bg-primary"
                                style={{
                                    width: `${width}%`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}