import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { PatientAppointmentRow } from "@/features/appointments/components/patient-appointment-row";
import type { AppointmentResponse } from "@/types/appointment";

type UpcomingAppointmentsPreviewProps = {
    appointments: AppointmentResponse[];
};

export function UpcomingAppointmentsPreview({
    appointments,
}: UpcomingAppointmentsPreviewProps) {
    if (appointments.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="upcoming-appointments-title">
            <header className="flex items-center justify-between gap-4">
                <h2
                    id="upcoming-appointments-title"
                    className="text-xs font-medium uppercase text-muted-foreground"
                >
                    Upcoming appointments
                </h2>

                <Button
                    render={
                        <Link href="/patient/appointments" />
                    }
                    nativeButton={false}
                    variant="link"
                    size="xs"
                >
                    View all
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        data-icon="inline-end"
                    />
                </Button>
            </header>

            <ul className="mt-1 divide-y">
                {appointments.map((appointment) => (
                    <PatientAppointmentRow
                        key={appointment.id}
                        appointment={appointment}
                    />
                ))}
            </ul>
        </section>
    );
}