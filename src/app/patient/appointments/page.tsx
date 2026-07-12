"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
    useCancelAppointment,
    usePatientAppointments,
} from "@/features/appointments/api";
import { CancelAppointmentDialog } from "@/features/appointments/components/cancel-appointment-dialog";
import { PatientAppointmentRow } from "@/features/appointments/components/patient-appointment-row";
import type { AppointmentResponse } from "@/types/appointment";

const PAGE_SIZE = 10;

export default function PatientAppointmentsPage() {
    const [page, setPage] = useState(0);
    const cancelAppointment = useCancelAppointment();

    const {
        data: appointments,
        error,
        isLoading,
        mutate: refreshAppointments,
    } = usePatientAppointments({
        page,
        size: PAGE_SIZE,
        sort: "startTime,desc",
    });

    const currentAppointments = appointments?.content ?? [];

    const upcomingAppointments = currentAppointments
        .filter(isOpenAppointment)
        .sort((first, second) =>
            first.startTime.localeCompare(second.startTime),
        );

    const pastAndClosedAppointments = currentAppointments
        .filter((appointment) => !isOpenAppointment(appointment))
        .sort((first, second) =>
            second.startTime.localeCompare(first.startTime),
        );

    async function handleCancellation(
        appointmentId: number,
    ): Promise<string | null> {
        try {
            await cancelAppointment.trigger({
                appointmentId,
            });

            await refreshAppointments();

            return null;
        } catch (error) {
            return error instanceof Error
                ? error.message
                : "Appointment could not be cancelled";
        }
    }

    function renderAppointment(
        appointment: AppointmentResponse,
    ) {
        const canCancel = isOpenAppointment(appointment);

        return (
            <PatientAppointmentRow
                key={appointment.id}
                appointment={appointment}
                actions={
                    canCancel ? (
                        <CancelAppointmentDialog
                            appointmentId={appointment.id}
                            doctorName={appointment.doctorFullName}
                            isCancelling={
                                cancelAppointment.isMutating
                            }
                            onConfirm={handleCancellation}
                        />
                    ) : undefined
                }
            />
        );
    }

    const showInitialLoading = isLoading && !appointments;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <h1 className="text-xl font-semibold">
                My appointments
            </h1>

            {showInitialLoading && (
                <div
                    role="status"
                    className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    <span>Loading appointments...</span>
                </div>
            )}

            {!showInitialLoading && error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Appointments could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                </div>
            )}

            {!showInitialLoading &&
                !error &&
                appointments &&
                currentAppointments.length === 0 && (
                    <Empty className="min-h-64">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <HugeiconsIcon
                                    icon={Calendar03Icon}
                                    strokeWidth={2}
                                />
                            </EmptyMedia>

                            <EmptyTitle>
                                No appointments found
                            </EmptyTitle>

                            <EmptyDescription>
                                You have not booked any appointments
                                yet.
                            </EmptyDescription>
                        </EmptyHeader>

                        <EmptyContent>
                            <Button
                                render={
                                    <Link href="/patient/book-appointment" />
                                }
                                nativeButton={false}
                                size="sm"
                            >
                                Book an appointment
                            </Button>
                        </EmptyContent>
                    </Empty>
                )}

            {!error && upcomingAppointments.length > 0 && (
                <section aria-labelledby="upcoming-appointments-title">
                    <h2
                        id="upcoming-appointments-title"
                        className="text-xs font-medium uppercase text-muted-foreground"
                    >
                        Upcoming
                    </h2>

                    <ul className="mt-1 divide-y">
                        {upcomingAppointments.map(renderAppointment)}
                    </ul>
                </section>
            )}

            {!error &&
                pastAndClosedAppointments.length > 0 && (
                    <section aria-labelledby="past-appointments-title">
                        <h2
                            id="past-appointments-title"
                            className="text-xs font-medium uppercase text-muted-foreground"
                        >
                            Past and closed
                        </h2>

                        <ul className="mt-1 divide-y">
                            {pastAndClosedAppointments.map(
                                renderAppointment,
                            )}
                        </ul>
                    </section>
                )}

            {!error &&
                appointments &&
                appointments.totalPages > 1 && (
                    <nav
                        aria-label="Appointments pagination"
                        className="flex items-center justify-between gap-3 border-t pt-4"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={
                                appointments.first || isLoading
                            }
                            onClick={() =>
                                setPage((currentPage) =>
                                    Math.max(0, currentPage - 1),
                                )
                            }
                        >
                            <HugeiconsIcon
                                icon={ArrowLeft01Icon}
                                strokeWidth={2}
                                data-icon="inline-start"
                            />
                            Previous
                        </Button>

                        <span className="text-xs text-muted-foreground">
                            Page {appointments.number + 1} of{" "}
                            {appointments.totalPages}
                        </span>

                        <Button type="button" variant="outline" size="sm"
                            disabled={
                                appointments.last || isLoading
                            }
                            onClick={() =>
                                setPage(
                                    (currentPage) => currentPage + 1,
                                )
                            }
                        >
                            Next
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                strokeWidth={2}
                                data-icon="inline-end"
                            />
                        </Button>
                    </nav>
                )}
        </div>
    );
}

function isOpenAppointment(
    appointment: AppointmentResponse,
): boolean {
    return (
        appointment.status === "REQUESTED" ||
        appointment.status === "APPROVED"
    );
}