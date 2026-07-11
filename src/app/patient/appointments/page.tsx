"use client";

import { useState } from "react";
import Link from "next/link";

import { usePatientAppointments } from "@/features/appointments/api";

const PAGE_SIZE = 10;

export default function PatientAppointmentsPage() {
    const [page, setPage] = useState(0);

    const {
        data: appointments,
        error,
        isLoading,
    } = usePatientAppointments({
        page,
        size: PAGE_SIZE,
        sort: "startTime,desc",
    });

    return (
        <main>
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

            {appointments &&
                appointments.content.length === 0 && (
                    <section>
                        <h2>No appointments found</h2>

                        <Link href="/patient/book-appointment">
                            Book your first appointment
                        </Link>
                    </section>
                )}

            {appointments?.content.map((appointment) => (
                <article key={appointment.id}>
                    <header>
                        <h2>{appointment.doctorFullName}</h2>
                        <p>{appointment.status}</p>
                    </header>

                    <dl>
                        <div>
                            <dt>Date and time</dt>
                            <dd>{formatDateTime(appointment.startTime)}</dd>
                        </div>

                        <div>
                            <dt>Appointment type</dt>
                            <dd>
                                {appointment.type === "ONLINE"
                                    ? "Online"
                                    : "Walk in"}
                            </dd>
                        </div>

                        <div>
                            <dt>Duration</dt>
                            <dd>
                                {formatTime(appointment.startTime)} -{" "}
                                {formatTime(appointment.endTime)}
                            </dd>
                        </div>

                        {appointment.reason && (
                            <div>
                                <dt>Reason</dt>
                                <dd>{appointment.reason}</dd>
                            </div>
                        )}
                    </dl>
                </article>
            ))}

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
        </main>
    );
}

function formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}