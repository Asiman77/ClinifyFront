import { Badge } from "@/components/ui/badge";
import type { LabStatus } from "@/types/lab";

const STATUS_CONFIG = {
    PENDING: {
        label: "Pending",
        className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    },
    IN_PROGRESS: {
        label: "In progress",
        className: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
    },
    COMPLETED: {
        label: "Completed",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    },
    CANCELLED: {
        label: "Cancelled",
        className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    },
} satisfies Record<
    LabStatus,
    { label: string; className: string }
>;

export function LabStatusBadge({
    status,
}: {
    status: LabStatus;
}) {
    const config = STATUS_CONFIG[status];
    return (
        <Badge
            variant="outline"
            className={config.className}
        >
            {config.label}
        </Badge>
    );
}