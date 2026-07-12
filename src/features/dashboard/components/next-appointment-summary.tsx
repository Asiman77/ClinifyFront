import Link from "next/link";
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { PatientAppointmentRow } from "@/features/appointments/components/patient-appointment-row";
import type { AppointmentResponse } from "@/types/appointment";

type NextAppointmentSummaryProps = {
    appointment: AppointmentResponse | null;
};

export function NextAppointmentSummary({
    appointment,
}: NextAppointmentSummaryProps) {
    return (
        <section
            aria-labelledby="next-appointment-title"
            className="flex flex-col gap-2"
        >
            <h2
                id="next-appointment-title"
                className="text-xs font-medium uppercase text-muted-foreground"
            >
                Next appointment
            </h2>

            {appointment ? (
                <ul className="divide-y border-y">
                    <PatientAppointmentRow
                        appointment={appointment}
                    />
                </ul>
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 border-y py-4">
                    <div>
                        <p className="text-sm font-medium">
                            No upcoming appointments
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Book an appointment when you need care.
                        </p>
                    </div>

                    <Button render={<Link href="/patient/book-appointment" />}
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                    >
                        <HugeiconsIcon
                            icon={CalendarAdd01Icon}
                            strokeWidth={2}
                            data-icon="inline-start"
                        />
                        Book appointment
                    </Button>
                </div>
            )}
        </section>
    );
}