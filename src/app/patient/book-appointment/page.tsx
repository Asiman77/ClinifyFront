"use client";

import { useState } from "react";
import { useAvailableSlots, useDepartments, useDoctors, } from "@/features/catalog/api";
import type { AvailableSlot } from "@/types/slot";
import { AppointmentResponse } from "@/types/appointment";
import { AppointmentApiError, useCreateAppointment } from "@/features/appointments/api";
import { DoctorSelection } from "@/features/appointments/booking/doctor-selection";
import { AppointmentSchedule } from "@/features/appointments/booking/appointment-schedule";
import { BookingConfirmation } from "@/features/appointments/booking/booking-confirmation";
import { BookingSuccess } from "@/features/appointments/booking/booking-success";

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
        setReason("");
        setCreatedAppointment(null);
    }

    function handleDoctorSelection(id: number) {
        if (id === doctorId) {
            return;
        }
        setDoctorId(id);
        setDate("");
        setSelectedSlot(null);
        setBookingError(null);
        setReason("");
        setCreatedAppointment(null);
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
        setReason("");
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
            }
        }
    }
    if (createdAppointment) {
        return (
            <div className="mx-auto w-full max-w-3xl">
                <BookingSuccess appointment={createdAppointment} />
            </div>
        );
    }
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {!selectedDoctor ? (
                <>
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
                </>
            ) : (
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
                    confirmation={
                        selectedSlot ? (
                            <BookingConfirmation
                                date={date}
                                slot={selectedSlot}
                                reason={reason}
                                isSubmitting={createAppointment.isMutating}
                                errorMessage={bookingError ?? undefined}
                                onReasonChange={setReason}
                                onConfirm={handleAppointmentCreation}
                            />
                        ) : bookingError ? (
                            <p
                                role="alert"
                                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                            >
                                {bookingError}
                            </p>
                        ) : undefined
                    }
                />
            )}
        </div>
    );
}
