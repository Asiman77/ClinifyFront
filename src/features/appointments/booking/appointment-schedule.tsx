"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { DoctorProfile } from "@/types/doctor";
import type { AvailableSlot } from "@/types/slot";

type AppointmentScheduleProps = {
    doctor: DoctorProfile;
    date: string;
    slots: AvailableSlot[];
    selectedSlot: AvailableSlot | null;
    slotsLoading: boolean;
    slotsError?: string;
    onDateChange: (date: string) => void;
    onSlotSelect: (slot: AvailableSlot) => void;
    onChangeDoctor: () => void;
};

export function AppointmentSchedule({
    doctor,
    date,
    slots,
    selectedSlot,
    slotsLoading,
    slotsError,
    onDateChange,
    onSlotSelect,
    onChangeDoctor,
}: AppointmentScheduleProps) {
    const initials = (
        doctor.doctorFirstName.charAt(0) +
        doctor.doctorLastName.charAt(0)
    ).toUpperCase();

    return (
        <section
            aria-labelledby="appointment-schedule-title"
            className="flex flex-col gap-6"
        >
            <h2 id="appointment-schedule-title" className="sr-only">
                Appointment schedule
            </h2>

            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-semibold text-muted-foreground">
                    {initials}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                        Dr. {doctor.doctorFirstName}{" "}
                        {doctor.doctorLastName}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                        {doctor.specialization}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                        {doctor.departmentName}
                    </p>
                </div>

                <Button type="button" variant="ghost" size="xs" onClick={onChangeDoctor}>
                    Change
                </Button>
            </div>

            <div className="grid items-start gap-6 sm:grid-cols-2">
                <Field>
                    <FieldLabel htmlFor="appointment-date">
                        Appointment date
                    </FieldLabel>
                    <Input
                        id="appointment-date"
                        type="date"
                        value={date}
                        onChange={(event) =>
                            onDateChange(event.target.value)
                        }
                    />
                </Field>

                <div className="flex flex-col gap-5">
                    <Field>
                        <FieldTitle>Available slots</FieldTitle>
                        {!date ? (
                            <p className="text-sm text-muted-foreground">
                                Select a date to see available slots.
                            </p>
                        ) : slotsLoading ? (
                            <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Spinner />
                                Loading available slots...
                            </div>
                        ) : slotsError ? (
                            <p role="alert" className="text-sm text-destructive">
                                {slotsError}
                            </p>
                        ) : slots.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No slots are available for this date.
                            </p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {slots.map((slot) => {
                                    const selected = selectedSlot?.startTime === slot.startTime;
                                    const start = formatSlotTime(slot.startTime);
                                    const end = formatSlotTime(slot.endTime);
                                    return (
                                        <Button
                                            key={`${slot.startTime}-${slot.endTime}`}
                                            type="button"
                                            size="sm"
                                            variant={selected ? "default" : "outline"}
                                            disabled={!slot.available}
                                            aria-pressed={selected}
                                            aria-label={
                                                `${start} to ${end}` +
                                                (!slot.available ? ", unavailable" : "")
                                            }
                                            onClick={() => onSlotSelect(slot)}
                                        >
                                            {start}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
                    </Field>
                </div>
            </div>
        </section>
    );
}

function formatSlotTime(dateTime: string): string {
    const separatorIndex = dateTime.indexOf("T");
    const time = separatorIndex >= 0 ? dateTime.slice(separatorIndex + 1) : dateTime;
    return time.slice(0, 5);
}