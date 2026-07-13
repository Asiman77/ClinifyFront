import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LabStatus } from "@/features/doctor/records/types";

const LABELS: Record<LabStatus, string> = {
    NOT_REQUIRED: "Not required",
    REQUESTED: "Requested",
    PENDING: "Pending",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const STYLES: Record<LabStatus, string> = {
    NOT_REQUIRED: "bg-muted text-muted-foreground",
    REQUESTED: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    IN_PROGRESS: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    CANCELLED: "bg-muted text-muted-foreground",
};

export function LabStatusBadge({ status }: { status: LabStatus }) {
    return (
        <Badge
            variant="outline"
            className={cn("border-transparent", STYLES[status])}
        >
            {LABELS[status]}
        </Badge>
    );
}
