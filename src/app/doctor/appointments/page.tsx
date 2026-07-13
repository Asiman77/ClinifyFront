"use client";

import { useState } from "react";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { isUpcomingAppointment } from "@/features/appointments/upcoming";
import {
    type DoctorAppointmentAction,
    useDoctorAppointmentAction,
    useDoctorAppointments,
} from "@/features/doctor/appointments/api";
import { DoctorAppointmentActions } from "@/features/doctor/appointments/doctor-appointment-actions";
import { DoctorAppointmentRow } from "@/features/doctor/appointments/doctor-appointment-row";
import type { AppointmentResponse } from "@/types/appointment";

const PAGE_SIZE = 10;

export default function DoctorAppointmentsPage() {
    const [page, setPage] = useState(0);
    const actionMutation = useDoctorAppointmentAction();
    const {
        data,
        error,
        isLoading,
        mutate: refreshAppointments,
    } = useDoctorAppointments({
        page,
        size: PAGE_SIZE,
        sort: "startTime,desc",
    });

    const appointments = data?.page.content ?? [];
    const upcoming = data
        ? appointments
              .filter((appointment) =>
                  isUpcomingAppointment(
                      appointment,
                      data.currentDateTime,
                  ),
              )
              .sort((first, second) =>
                  first.startTime.localeCompare(second.startTime),
              )
        : [];
    const pastAndClosed = data
        ? appointments
              .filter(
                  (appointment) =>
                      !isUpcomingAppointment(
                          appointment,
                          data.currentDateTime,
                      ),
              )
              .sort((first, second) =>
                  second.startTime.localeCompare(first.startTime),
              )
        : [];

    async function handleAction(
        appointmentId: number,
        action: DoctorAppointmentAction,
    ): Promise<string | null> {
        try {
            await actionMutation.trigger({ appointmentId, action });
            await refreshAppointments();
            return null;
        } catch (error) {
            return error instanceof Error
                ? error.message
                : "Appointment status could not be updated";
        }
    }

    function renderAppointment(appointment: AppointmentResponse) {
        return (
            <DoctorAppointmentRow
                key={appointment.id}
                appointment={appointment}
                actions={
                    <DoctorAppointmentActions
                        appointmentId={appointment.id}
                        status={appointment.status}
                        isMutating={actionMutation.isMutating}
                        onAction={handleAction}
                    />
                }
            />
        );
    }

    const showInitialLoading = isLoading && !data;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <h1 className="text-xl font-semibold">Appointments</h1>

            {showInitialLoading && (
                <div
                    role="status"
                    className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    Loading appointments...
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

            {!showInitialLoading && !error && appointments.length === 0 && (
                <Empty className="min-h-64">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <HugeiconsIcon
                                icon={Calendar03Icon}
                                strokeWidth={2}
                            />
                        </EmptyMedia>
                        <EmptyTitle>No appointments found</EmptyTitle>
                        <EmptyDescription>
                            Assigned appointments will appear here.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}

            {!error && upcoming.length > 0 && (
                <section aria-labelledby="doctor-upcoming-title">
                    <h2
                        id="doctor-upcoming-title"
                        className="text-xs font-medium uppercase text-muted-foreground"
                    >
                        Upcoming
                    </h2>
                    <ul className="mt-1 divide-y">
                        {upcoming.map(renderAppointment)}
                    </ul>
                </section>
            )}

            {!error && pastAndClosed.length > 0 && (
                <section aria-labelledby="doctor-past-title">
                    <h2
                        id="doctor-past-title"
                        className="text-xs font-medium uppercase text-muted-foreground"
                    >
                        Past and closed
                    </h2>
                    <ul className="mt-1 divide-y">
                        {pastAndClosed.map(renderAppointment)}
                    </ul>
                </section>
            )}

            {!error && data && data.page.totalPages > 1 && (
                <nav
                    aria-label="Appointments pagination"
                    className="flex items-center justify-between gap-3 border-t pt-4"
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={data.page.first || isLoading}
                        onClick={() =>
                            setPage((current) => Math.max(0, current - 1))
                        }
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            data-icon="inline-start"
                        />
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {data.page.number + 1} of {data.page.totalPages}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={data.page.last || isLoading}
                        onClick={() => setPage((current) => current + 1)}
                    >
                        Next
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            data-icon="inline-end"
                        />
                    </Button>
                </nav>
            )}
        </div>
    );
}
