import type { AppointmentResponse } from "@/types/appointment";

export function isOpenAppointment(
    appointment: AppointmentResponse,
): boolean {
    return (
        appointment.status === "REQUESTED" ||
        appointment.status === "APPROVED"
    );
}

export function isUpcomingAppointment(
    appointment: AppointmentResponse,
    currentDateTime: string,
): boolean {
    if (!isOpenAppointment(appointment)) {
        return false;
    }

    const appointmentTime = Date.parse(appointment.startTime);
    const currentTime = Date.parse(currentDateTime);

    if (
        Number.isNaN(appointmentTime) ||
        Number.isNaN(currentTime)
    ) {
        return false;
    }

    return appointmentTime > currentTime;
}

export function getUpcomingAppointments(
    appointments: AppointmentResponse[],
    currentDateTime: string,
    limit = 3,
): AppointmentResponse[] {
    const safeLimit = Math.max(0, Math.trunc(limit));

    if (safeLimit === 0) {
        return [];
    }

    return appointments
        .filter((appointment) =>
            isUpcomingAppointment(
                appointment,
                currentDateTime,
            ),
        )
        .sort(
            (first, second) =>
                Date.parse(first.startTime) -
                Date.parse(second.startTime),
        )
        .slice(0, safeLimit);
}