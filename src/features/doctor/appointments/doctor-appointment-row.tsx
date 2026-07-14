import type { ReactNode } from "react";
import {
    Location01Icon,
    Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { AppointmentStatusFlow } from "@/features/doctor/appointments/appointment-status-flow";
import type { AppointmentResponse } from "@/types/appointment";

type DoctorAppointmentRowProps = {
    appointment: AppointmentResponse;
    actions?: ReactNode;
};

export function DoctorAppointmentRow({
    appointment,
    actions,
}: DoctorAppointmentRowProps) {
    const isOnline = appointment.type === "ONLINE";
    const typeLabel = isOnline
        ? "Online appointment"
        : "Walk-in appointment";

    return (
        <li className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                    title={typeLabel}
                >
                    <HugeiconsIcon
                        icon={isOnline ? Video01Icon : Location01Icon}
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    <span className="sr-only">{typeLabel}</span>
                </span>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {appointment.patientFullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.startTime)}
                        {" \u00B7 "}
                        <span className="tabular-nums">
                            {formatTime(appointment.startTime)}
                            {"\u2013"}
                            {formatTime(appointment.endTime)}
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
                <AppointmentStatusFlow status={appointment.status} />
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
    const [yearText = "", monthText = "", dayText = ""] =
        dateTime.slice(0, 10).split("-");
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
