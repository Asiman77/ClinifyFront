import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/appointment";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
    REQUESTED: "Requested",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No show",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
    REQUESTED:
        "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    APPROVED:
        "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    REJECTED:
        "bg-destructive/10 text-destructive",
    COMPLETED:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    CANCELLED:
        "bg-muted text-muted-foreground",
    NO_SHOW:
        "bg-orange-500/10 text-orange-700 dark:text-orange-300",
};

type AppointmentStatusBadgeProps = {
    status: AppointmentStatus;
};

export function AppointmentStatusBadge({
    status,
}: AppointmentStatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "border-transparent",
                STATUS_STYLES[status],
            )}
        >
            {STATUS_LABELS[status]}
        </Badge>
    );
}