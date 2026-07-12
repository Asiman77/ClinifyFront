"use client";

import { useState } from "react";
import { useAvailableSlots, useDepartments, useDoctors, } from "@/features/catalog/api";
import type { AvailableSlot } from "@/types/slot";
import { AppointmentResponse } from "@/types/appointment";
import { AppointmentApiError, useCreateAppointment } from "@/features/appointments/api";
import { DoctorSelection } from "@/features/appointments/booking/doctor-selection";
import { AppointmentSchedule } from "@/features/appointments/booking/appointment-schedule";

const PAGE_SIZE = 10;
const SLOT_PAGE_SIZE = 50;

export default function BookAppointmentPage() {
    const [departmentId, setDepartmentId] = useState<number | undefined>();
    const [doctorId, setDoctorId] = useState<number | undefined>();
    const [date, setDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
    const [reason, setReason] = useState("");
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [createdAppointment, setCreatedAppointment] = useState<AppointmentResponse | null>(null);
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
    const selectedDoctor = doctors?.content.find(
        (doctor) => doctor.id === doctorId,
    );

    function handleDepartmentChange(value?: number) {
        setDepartmentId(value);
        setDoctorId(undefined);
        setDate("");
        setSelectedSlot(null);
        setBookingError(null);
    }

    function handleDoctorSelection(id: number) {
        if (id === doctorId) {
            return;
        }
        setDoctorId(id);
        setDate("");
        setSelectedSlot(null);
        setBookingError(null);
    }

    function handleDateChange(value: string) {
        setDate(value);
        setSelectedSlot(null);
        setBookingError(null);
        setCreatedAppointment(null);
    }
    function handleSlotSelection(slot: AvailableSlot) {
        setSelectedSlot(slot);
        setBookingError(null);
        setCreatedAppointment(null);
    }
    function handleChangeDoctor() {
        setDoctorId(undefined);
        setDate("");
        setSelectedSlot(null);
        setBookingError(null);
        setCreatedAppointment(null);
    }
    async function handleAppointmentCreation() {
        if (!doctorId || !selectedSlot) {
            return;
        }
        setBookingError(null);
        setCreatedAppointment(null);

        const normalizedReason = reason.trim();
        try {
            const appointment = await createAppointment.trigger({
                doctorId,
                startTime: selectedSlot.startTime,
                ...(normalizedReason ? { reason: normalizedReason } : {}),
            });

            setCreatedAppointment(appointment);
            setSelectedSlot(null);
            setReason("");

            await refreshSlots();
        } catch (error) {
            setBookingError(
                error instanceof Error ? error.message : "Appointment could not be created",
            );

            if (error instanceof AppointmentApiError && error.status === 409) {
                setSelectedSlot(null);
                await refreshSlots();
            }
        }
    }
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <header>
                <h1 className="text-xl font-semibold">
                    Book an appointment
                </h1>
            </header>
            <DoctorSelection
                departments={departments ?? []}
                doctors={doctors?.content ?? []}
                departmentId={departmentId}
                selectedDoctorId={doctorId}
                departmentsLoading={departmentsLoading}
                doctorsLoading={doctorsLoading}
                errorMessage={
                    departmentsError?.message ??
                    doctorsError?.message
                }
                onDepartmentChange={handleDepartmentChange}
                onDoctorSelect={handleDoctorSelection}
            />
            {selectedDoctor && (
                <AppointmentSchedule
                    doctor={selectedDoctor}
                    date={date}
                    slots={slots?.content ?? []}
                    selectedSlot={selectedSlot}
                    slotsLoading={slotsLoading}
                    slotsError={slotsError?.message}
                    onDateChange={handleDateChange}
                    onSlotSelect={handleSlotSelection}
                    onChangeDoctor={handleChangeDoctor}
                />
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