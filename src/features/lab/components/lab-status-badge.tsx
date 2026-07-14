import { Badge } from "@/components/ui/badge";
import type { LabStatus } from "@/types/lab";

const STATUS_CONFIG = {
    NOT_REQUIRED: {
        label: "Not required",
        className:
            "border-transparent bg-gray-500/15 text-gray-600 dark:text-gray-400",
    },
    REQUESTED: {
        label: "Requested",
        className:
            "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    PENDING: {
        label: "Pending",
        className: "border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    },
    IN_PROGRESS: {
        label: "In progress",
        className: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400",
    },
    COMPLETED: {
        label: "Completed",
        className: "border-transparent bg-green-500/15 text-green-700 dark:text-green-400",
    },
    CANCELLED: {
        label: "Cancelled",
        className: "border-transparent bg-gray-500/15 text-gray-600 dark:text-gray-400",
    },
} satisfies Record<LabStatus, { label: string; className: string }>;

export function LabStatusBadge({
    status,
}: {
    status: LabStatus;
}) {
    if (
        status === "NOT_REQUIRED" ||
        status === "REQUESTED"
    ) {
        return null;
    }
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