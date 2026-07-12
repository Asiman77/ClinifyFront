"use client";

import { useState } from "react";

import {
    useAvailableSlots,
    useDepartments,
    useDoctors,
} from "@/features/catalog/api";
import type { AvailableSlot } from "@/types/slot";
import { AppointmentResponse } from "@/types/appointment";
import { AppointmentApiError, useCreateAppointment } from "@/features/appointments/api";

const PAGE_SIZE = 10;
const SLOT_PAGE_SIZE = 50;

export default function BookAppointmentPage() {
    const [departmentId, setDepartmentId] =
        useState<number | undefined>();

    const [doctorId, setDoctorId] =
        useState<number | undefined>();

    const [date, setDate] = useState("");

    const [selectedSlot, setSelectedSlot] =
        useState<AvailableSlot | null>(null);

    const [reason, setReason] = useState("");
    const [bookingError, setBookingError] =
        useState<string | null>(null);
    const [createdAppointment, setCreatedAppointment] =
        useState<AppointmentResponse | null>(null);

    const createAppointment = useCreateAppointment();

    const {
        data: departments,
        error: departmentsError,
        isLoading: departmentsLoading,
    } = useDepartments();

    const {
        data: doctors,
        error: doctorsError,
        isLoading: doctorsLoading,
    } = useDoctors({
        departmentId,
        page: 0,
        size: PAGE_SIZE,
        sort: "id,asc",
    });

    const {
        data: slots,
        error: slotsError,
        isLoading: slotsLoading,
        mutate: refreshSlots,
    } = useAvailableSlots({
        doctorId,
        date,
        type: "ONLINE",
        page: 0,
        size: SLOT_PAGE_SIZE,
    });

    function handleDepartmentChange(value: string) {
        setDepartmentId(value ? Number(value) : undefined);
        setDoctorId(undefined);
        setSelectedSlot(null);
    }

    function handleDoctorSelection(id: number) {
        setDoctorId(id);
        setSelectedSlot(null);
    }

    function handleDateChange(value: string) {
        setDate(value);
        setSelectedSlot(null);
    }

    async function handleAppointmentCreation() {
        if (!doctorId || !selectedSlot) {
            return;
        }

        setBookingError(null);
        setCreatedAppointment(null);

        const normalizedReason = reason.trim();

        try {
            const appointment =
                await createAppointment.trigger({
                    doctorId,
                    startTime: selectedSlot.startTime,
                    ...(normalizedReason
                        ? { reason: normalizedReason }
                        : {}),
                });

            setCreatedAppointment(appointment);
            setSelectedSlot(null);
            setReason("");

            await refreshSlots();
        } catch (error) {
            setBookingError(
                error instanceof Error
                    ? error.message
                    : "Appointment could not be created",
            );

            if (
                error instanceof AppointmentApiError &&
                error.status === 409
            ) {
                setSelectedSlot(null);
                await refreshSlots();
            }
        }
    }
    return (
        <div>
            <header>
                <h1>Book an appointment</h1>
            </header>

            <section aria-labelledby="department-title">
                <h2 id="department-title">Choose a department</h2>

                <label htmlFor="department">Department</label>

                <select
                    id="department"
                    value={departmentId ?? ""}
                    disabled={departmentsLoading}
                    onChange={(event) =>
                        handleDepartmentChange(event.target.value)
                    }
                >
                    <option value="">All departments</option>

                    {departments
                        ?.filter((department) => department.active)
                        .map((department) => (
                            <option
                                key={department.id}
                                value={department.id}
                            >
                                {department.name}
                            </option>
                        ))}
                </select>

                {departmentsLoading && (
                    <p role="status">Loading departments...</p>
                )}

                {departmentsError && (
                    <p role="alert">{departmentsError.message}</p>
                )}
            </section>

            <section aria-labelledby="doctor-title">
                <h2 id="doctor-title">Choose a doctor</h2>

                {doctorsLoading && (
                    <p role="status">Loading doctors...</p>
                )}

                {doctorsError && (
                    <p role="alert">{doctorsError.message}</p>
                )}

                {doctors && doctors.content.length === 0 && (
                    <p>No doctors found.</p>
                )}

                {doctors?.content.map((doctor) => (
                    <article key={doctor.id}>
                        <h3>
                            Dr. {doctor.doctorFirstName}{" "}
                            {doctor.doctorLastName}
                        </h3>

                        <p>{doctor.departmentName}</p>
                        <p>{doctor.specialization}</p>

                        <button
                            type="button"
                            aria-pressed={doctorId === doctor.id}
                            onClick={() =>
                                handleDoctorSelection(doctor.id)
                            }
                        >
                            {doctorId === doctor.id
                                ? "Selected"
                                : "Select doctor"}
                        </button>
                    </article>
                ))}
            </section>

            {doctorId && (
                <section aria-labelledby="date-title">
                    <h2 id="date-title">Choose a date</h2>

                    <label htmlFor="appointment-date">
                        Appointment date
                    </label>

                    <input
                        id="appointment-date"
                        type="date"
                        value={date}
                        onChange={(event) =>
                            handleDateChange(event.target.value)
                        }
                    />
                </section>
            )}

            {doctorId && date && (
                <section aria-labelledby="slots-title">
                    <h2 id="slots-title">Available online slots</h2>

                    {slotsLoading && (
                        <p role="status">Loading available slots...</p>
                    )}

                    {slotsError && (
                        <p role="alert">{slotsError.message}</p>
                    )}

                    {slots && slots.content.length === 0 && (
                        <p>No slots found for this date.</p>
                    )}

                    {slots?.content.map((slot) => {
                        const isSelected =
                            selectedSlot?.startTime === slot.startTime;

                        return (
                            <button
                                key={`${slot.startTime}-${slot.endTime}`}
                                type="button"
                                disabled={!slot.available}
                                aria-pressed={isSelected}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {formatTime(slot.startTime)} -{" "}
                                {formatTime(slot.endTime)}
                                {!slot.available ? " Unavailable" : ""}
                            </button>
                        );
                    })}
                </section>
            )}

            {selectedSlot && (
                <section aria-labelledby="selection-title">
                    <h2 id="selection-title">Selected appointment</h2>

                    <p>Date: {date}</p>
                    <p>Type: Online</p>
                    <p>
                        Time: {formatTime(selectedSlot.startTime)} -{" "}
                        {formatTime(selectedSlot.endTime)}
                    </p>
                    <label htmlFor="appointment-reason">
                        Reason
                    </label>
                    <textarea
                        id="appointment-reason"
                        value={reason}
                        maxLength={1000}
                        disabled={createAppointment.isMutating}
                        onChange={(event) => setReason(event.target.value)}
                    />
                    <button
                        type="button"
                        disabled={createAppointment.isMutating}
                        onClick={handleAppointmentCreation}
                    >
                        {createAppointment.isMutating
                            ? "Booking..."
                            : "Confirm appointment"}
                    </button>
                </section>
            )}
            {bookingError && (
                <p role="alert">{bookingError}</p>
            )}

            {createdAppointment && (
                <section aria-labelledby="booking-success-title">
                    <h2 id="booking-success-title">
                        Appointment created
                    </h2>
                    <p>
                        Doctor: {createdAppointment.doctorFullName}
                    </p>
                    <p>
                        Time: {formatTime(createdAppointment.startTime)} -{" "}
                        {formatTime(createdAppointment.endTime)}
                    </p>
                    <p>Status: {createdAppointment.status}</p>
                </section>
            )}
        </div>
    );
}

function formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}