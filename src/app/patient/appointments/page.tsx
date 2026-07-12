"use client";

import { useState } from "react";
import Link from "next/link";

import { useCancelAppointment, usePatientAppointments } from "@/features/appointments/api";
import { CancelAppointmentDialog } from "@/features/appointments/components/cancel-appointment-dialog";
import { PatientAppointmentRow } from "@/features/appointments/components/patient-appointment-row";

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

    async function handleCancellation(appointmentId: number,): Promise<string | null> {
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

    return (
        <div>
            <header>
                <h1>My appointments</h1>

                <Link href="/patient/book-appointment">
                    Book an appointment
                </Link>
            </header>

            {isLoading && (
                <p role="status">Loading appointments...</p>
            )}

            {error && (
                <p role="alert">{error.message}</p>
            )}

            {appointments && appointments.content.length === 0 && (
                <section>
                    <h2>No appointments found</h2>

                    <Link href="/patient/book-appointment">
                        Book your first appointment
                    </Link>
                </section>
            )}

            {appointments && appointments.content.length > 0 && (
                <ul className="divide-y">
                    {appointments.content.map((appointment) => {
                        const canCancel = appointment.status === "REQUESTED" || appointment.status === "APPROVED";
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
                    })}
                </ul>
            )}

            {appointments &&
                appointments.totalPages > 1 && (
                    <nav aria-label="Appointments pagination">
                        <button
                            type="button"
                            disabled={appointments.first || isLoading}
                            onClick={() =>
                                setPage((currentPage) =>
                                    Math.max(0, currentPage - 1),
                                )
                            }
                        >
                            Previous
                        </button>

                        <span>
                            Page {appointments.number + 1} of{" "}
                            {appointments.totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={appointments.last || isLoading}
                            onClick={() =>
                                setPage((currentPage) => currentPage + 1)
                            }
                        >
                            Next
                        </button>
                    </nav>
                )}
        </div>
    );
}
