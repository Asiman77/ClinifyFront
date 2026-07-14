"use client";

import type { DistributionDonutDatum } from "@/features/charts/distribution-donut";
import { DoctorStatusDonutLoader } from "@/features/charts/doctor-status-donut-loader";
import { StatusDonutLoader } from "@/features/charts/status-donut-loader";
import {
    Progress,
    ProgressLabel,
} from "@/components/ui/progress";
import {
    APPOINTMENT_STATUSES,
    type AppointmentResponse,
} from "@/types/appointment";

export function DoctorDashboardAnalytics({
    appointments,
}: {
    appointments: AppointmentResponse[];
}) {
    if (appointments.length === 0) {
        return null;
    }

    const statusDistribution = APPOINTMENT_STATUSES.map(
        (status) => ({
            status,
            count: appointments.filter(
                (appointment) => appointment.status === status,
            ).length,
        }),
    );

    const typeDistribution: DistributionDonutDatum[] = [
        {
            key: "ONLINE",
            label: "Online",
            count: appointments.filter(
                (appointment) => appointment.type === "ONLINE",
            ).length,
            color: "blue",
        },
        {
            key: "WALK_IN",
            label: "Walk-in",
            count: appointments.filter(
                (appointment) => appointment.type === "WALK_IN",
            ).length,
            color: "orange",
        },
    ];

    const completed = appointments.filter(
        (appointment) => appointment.status === "COMPLETED",
    ).length;

    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
                <section className="flex flex-col gap-2">
                    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Appointments by status
                    </h2>
                    <StatusDonutLoader
                        data={statusDistribution}
                        totalLabel="Total"
                    />
                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Online vs. walk-in
                    </h2>
                    <DoctorStatusDonutLoader
                        data={typeDistribution}
                        totalLabel="Total"
                    />
                </section>
            </div>

            <section className="flex flex-col gap-2 sm:max-w-sm">
                <Progress
                    value={(completed / appointments.length) * 100}
                >
                    <ProgressLabel>Completion rate</ProgressLabel>
                    <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                        {completed}/{appointments.length} completed
                    </span>
                </Progress>
            </section>
        </div>
    );
}