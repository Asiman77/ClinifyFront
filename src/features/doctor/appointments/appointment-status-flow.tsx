import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/appointment";

const FLOW: AppointmentStatus[] = [
    "REQUESTED",
    "APPROVED",
    "COMPLETED",
];

const DOT_STYLES: Record<AppointmentStatus, string> = {
    REQUESTED: "bg-amber-500",
    APPROVED: "bg-cyan-500",
    COMPLETED: "bg-emerald-500",
    REJECTED: "bg-destructive",
    CANCELLED: "bg-muted-foreground",
    NO_SHOW: "bg-orange-500",
};

export function AppointmentStatusFlow({
    status,
}: {
    status: AppointmentStatus;
}) {
    const reachedIndex = FLOW.indexOf(status);

    if (reachedIndex === -1) {
        return (
            <span
                aria-hidden="true"
                className={cn(
                    "size-1.5 rounded-full",
                    DOT_STYLES[status],
                )}
            />
        );
    }

    return (
        <span aria-hidden="true" className="inline-flex items-center gap-1">
            {FLOW.map((flowStatus, index) => (
                <span
                    key={flowStatus}
                    className={cn(
                        "size-1.5 rounded-full",
                        index <= reachedIndex
                            ? DOT_STYLES[status]
                            : "bg-border",
                    )}
                />
            ))}
        </span>
    );
}
