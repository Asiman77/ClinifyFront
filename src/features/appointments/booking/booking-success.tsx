import Link from "next/link";
import { Calendar03Icon, CheckmarkCircle02Icon, } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppointmentResponse } from "@/types/appointment";

type BookingSuccessProps = {
    appointment: AppointmentResponse;
};

export function BookingSuccess({
    appointment,
}: BookingSuccessProps) {
    return (
        <section aria-labelledby="booking-success-title" className="flex flex-col gap-5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div>
                        <h2 id="booking-success-title" className="text-base font-semibold">
                            Appointment created
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Your appointment request was submitted successfully.
                        </p>
                    </div>
                </div>
                <Badge variant="secondary">
                    {formatStatus(appointment.status)}
                </Badge>
            </header>
            <dl className="grid gap-4 border-y border-emerald-500/20 py-4 sm:grid-cols-2">
                <div>
                    <dt className="text-xs text-muted-foreground">
                        Doctor
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                        {appointment.doctorFullName}
                    </dd>
                </div>

                <div>
                    <dt className="text-xs text-muted-foreground">
                        Schedule
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                        {formatDate(appointment.startTime)}
                        <span className="ml-2 tabular-nums">
                            {formatTime(appointment.startTime)} -{" "}
                            {formatTime(appointment.endTime)}
                        </span>
                    </dd>
                </div>
            </dl>

            <div className="flex justify-end">
                <Button render={<Link href="/patient/appointments" />}
                    nativeButton={false}
                    variant="outline"
                    size="sm"
                >
                    <HugeiconsIcon
                        icon={Calendar03Icon}
                        strokeWidth={2}
                        data-icon="inline-start"
                    />
                    View appointments
                </Button>
            </div>
        </section>
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

function formatStatus(status: string): string {
    return status
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase(),)
        .join(" ");
}