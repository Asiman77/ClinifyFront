import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { DoctorAppointmentRow } from "@/features/doctor/appointments/doctor-appointment-row";
import type { AppointmentResponse } from "@/types/appointment";

export function DoctorUpcomingPreview({
    appointments,
}: {
    appointments: AppointmentResponse[];
}) {
    return (
        <section aria-labelledby="dashboard-upcoming-title">
            <header className="flex items-center justify-between gap-4">
                <h2
                    id="dashboard-upcoming-title"
                    className="text-xs font-medium uppercase text-muted-foreground"
                >
                    Upcoming appointments
                </h2>
                <Button
                    render={<Link href="/doctor/appointments" />}
                    nativeButton={false}
                    variant="link"
                    size="xs"
                >
                    View all
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        data-icon="inline-end"
                    />
                </Button>
            </header>

            {appointments.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                    No upcoming appointments.
                </p>
            ) : (
                <ul className="mt-1 divide-y">
                    {appointments.map((appointment) => (
                        <DoctorAppointmentRow
                            key={appointment.id}
                            appointment={appointment}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}
