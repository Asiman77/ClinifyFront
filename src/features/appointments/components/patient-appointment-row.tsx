import type { ReactNode } from "react";
import {
    HospitalLocationIcon,
    Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { cn } from "@/lib/utils";
import type { AppointmentResponse } from "@/types/appointment";

type PatientAppointmentRowProps = {
    appointment: AppointmentResponse;
    actions?: ReactNode;
};

export function PatientAppointmentRow({
    appointment,
    actions,
}: PatientAppointmentRowProps) {
    const isOnline = appointment.type === "ONLINE";

    return (
        <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <span
                    aria-hidden="true"
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        isOnline
                            ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    )}
                >
                    <HugeiconsIcon
                        icon={
                            isOnline
                                ? Video01Icon
                                : HospitalLocationIcon
                        }
                        strokeWidth={2}
                    />
                </span>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {appointment.doctorFullName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.startTime)}
                        {" / "}
                        <span className="tabular-nums">
                            {formatTime(appointment.startTime)} -{" "}
                            {formatTime(appointment.endTime)}
                        </span>
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {isOnline
                            ? "Online appointment"
                            : "Walk-in appointment"}
                    </p>

                    {appointment.reason && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {appointment.reason}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                <AppointmentStatusBadge status={appointment.status} />
                {actions}
            </div>
        </li>
    );
}

function formatTime(dateTime: string): string {
    const separatorIndex = dateTime.indexOf("T");
    const time = separatorIndex >= 0
        ? dateTime.slice(separatorIndex + 1)
        : dateTime;
    return time.slice(0, 5);
}

function formatDate(dateTime: string): string {
    const [
        yearText = "",
        monthText = "",
        dayText = "",
    ] = dateTime.slice(0, 10).split("-");

    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    if (!year || !month || !day) {
        return dateTime.slice(0, 10);
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
}