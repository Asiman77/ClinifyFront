"use client";

import { useState, type ComponentProps, type ReactElement } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateAvailability, useDeleteAvailability, useUpdateAvailability, useUpdateAvailabilityStatus, } from "@/features/admin/availabilities/api";
import { availabilityFormSchema, type AvailabilityFormValues, } from "@/features/admin/availabilities/schemas";
import { formatTime } from "@/lib/availability-grid";
import {
    DAYS_OF_WEEK, type AvailabilityType, type CreateDoctorAvailabilityRequest, type DayOfWeek, type DoctorAvailability, type UpdateDoctorAvailabilityRequest,
} from "@/types/availability";
import type { DoctorProfile } from "@/types/doctor";

const DAY_LABELS: Record<DayOfWeek, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
};

const TYPE_LABELS: Record<AvailabilityType, string> = {
    ONLINE_ONLY: "Online only",
    WALK_IN_ONLY: "Walk-in only",
    MIXED: "Mixed",
};

type AvailabilityFormDialogProps = {
    availability?: DoctorAvailability;
    doctors: DoctorProfile[];
    triggerLabel?: string;
    triggerProps?: ComponentProps<typeof Button>;
    trigger?: ReactElement;
};

export function AvailabilityFormDialog({
    availability,
    doctors,
    triggerLabel,
    triggerProps,
    trigger,
}: AvailabilityFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const createAvailability = useCreateAvailability();
    const updateAvailability = useUpdateAvailability();
    const updateStatus = useUpdateAvailabilityStatus();
    const deleteAvailability = useDeleteAvailability();

    const isEdit = availability !== undefined;
    const isBusy =
        createAvailability.isMutating ||
        updateAvailability.isMutating ||
        updateStatus.isMutating ||
        deleteAvailability.isMutating;

    const availableDoctors = doctors.filter(
        (doctor) => doctor.active || doctor.id === availability?.doctorId,
    );

    const doctorItems = Object.fromEntries(
        availableDoctors.map((doctor) => [
            String(doctor.id),
            getDoctorName(doctor),
        ]),
    );

    const dayItems = Object.fromEntries(
        DAYS_OF_WEEK.map((day) => [day, DAY_LABELS[day]]),
    );

    const typeItems = Object.fromEntries(Object.entries(TYPE_LABELS));

    const form = useForm<AvailabilityFormValues>({
        resolver: zodResolver(availabilityFormSchema),
        defaultValues: getDefaultValues(availability, availableDoctors),
    });

    const errors = form.formState.errors;

    const submit = form.handleSubmit(async (values) => {
        setServerError(null);

        try {
            if (availability) {
                const request: UpdateDoctorAvailabilityRequest = {
                    dayOfWeek: values.dayOfWeek,
                    startTime: values.startTime,
                    endTime: values.endTime,
                    slotDurationMinutes: values.slotDurationMinutes,
                    availabilityType: values.availabilityType,
                    active: availability.active,
                };

                await updateAvailability.trigger({
                    availabilityId: availability.id,
                    request,
                });
            } else {
                const request: CreateDoctorAvailabilityRequest = {
                    doctorId: values.doctorId,
                    dayOfWeek: values.dayOfWeek,
                    startTime: values.startTime,
                    endTime: values.endTime,
                    slotDurationMinutes: values.slotDurationMinutes,
                    availabilityType: values.availabilityType,
                    active: true,
                };

                await createAvailability.trigger(request);
            }

            setOpen(false);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Availability could not be saved",
            );
        }
    });

    async function toggleStatus() {
        if (!availability) {
            return;
        }

        setServerError(null);

        try {
            await updateStatus.trigger({
                availabilityId: availability.id,
                active: !availability.active,
            });

            setOpen(false);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Availability status could not be updated",
            );
        }
    }

    async function removeAvailability() {
        if (!availability) {
            return;
        }

        setServerError(null);

        try {
            await deleteAvailability.trigger({
                availabilityId: availability.id,
            });

            setOpen(false);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Availability could not be deleted",
            );
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                setServerError(null);

                if (nextOpen) {
                    form.reset(getDefaultValues(availability, availableDoctors));
                }
            }}
        >
            <DialogTrigger
                render={
                    trigger ?? (
                        <Button type="button" {...triggerProps}>
                            {triggerLabel}
                        </Button>
                    )
                }
            />

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit availability" : "Create availability"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} noValidate>
                    <FieldGroup className="gap-4">
                        <Controller
                            control={form.control}
                            name="doctorId"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={Boolean(fieldState.error)}>
                                    <FieldLabel htmlFor="availability-doctor">Doctor</FieldLabel>

                                    <Select
                                        items={doctorItems}
                                        value={field.value > 0 ? String(field.value) : null}
                                        disabled={isEdit || availableDoctors.length === 0}
                                        onValueChange={(value) =>
                                            field.onChange(value ? Number(value) : 0)
                                        }
                                    >
                                        <SelectTrigger id="availability-doctor" className="w-full">
                                            <SelectValue placeholder="Select a doctor" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                {availableDoctors.map((doctor) => (
                                                    <SelectItem key={doctor.id} value={String(doctor.id)}>
                                                        {getDoctorName(doctor)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <FieldError>{fieldState.error?.message}</FieldError>
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="dayOfWeek"
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel htmlFor="availability-day">Day</FieldLabel>

                                    <Select
                                        items={dayItems}
                                        value={field.value}
                                        onValueChange={(value) => {
                                            if (value) {
                                                field.onChange(value as DayOfWeek);
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="availability-day" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                {DAYS_OF_WEEK.map((day) => (
                                                    <SelectItem key={day} value={day}>
                                                        {DAY_LABELS[day]}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={Boolean(errors.startTime)}>
                                <FieldLabel htmlFor="availability-start">Start time</FieldLabel>
                                <Input
                                    id="availability-start"
                                    type="time"
                                    {...form.register("startTime")}
                                />
                                <FieldError>{errors.startTime?.message}</FieldError>
                            </Field>

                            <Field data-invalid={Boolean(errors.endTime)}>
                                <FieldLabel htmlFor="availability-end">End time</FieldLabel>
                                <Input
                                    id="availability-end"
                                    type="time"
                                    {...form.register("endTime")}
                                />
                                <FieldError>{errors.endTime?.message}</FieldError>
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={Boolean(errors.slotDurationMinutes)}>
                                <FieldLabel htmlFor="availability-slot">
                                    Slot duration
                                </FieldLabel>
                                <Input
                                    id="availability-slot"
                                    type="number"
                                    min={5}
                                    step={5}
                                    {...form.register("slotDurationMinutes", {
                                        valueAsNumber: true,
                                    })}
                                />
                                <FieldError>{errors.slotDurationMinutes?.message}</FieldError>
                            </Field>

                            <Controller
                                control={form.control}
                                name="availabilityType"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel htmlFor="availability-type">Type</FieldLabel>

                                        <Select
                                            items={typeItems}
                                            value={field.value}
                                            onValueChange={(value) => {
                                                if (value) {
                                                    field.onChange(value as AvailabilityType);
                                                }
                                            }}
                                        >
                                            <SelectTrigger id="availability-type" className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    {Object.entries(TYPE_LABELS).map(([type, label]) => (
                                                        <SelectItem key={type} value={type}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                        </div>

                        {serverError && <FieldError>{serverError}</FieldError>}

                        <DialogFooter className={isEdit ? "sm:justify-between" : undefined}>
                            {isEdit && (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive"
                                        disabled={isBusy}
                                        onClick={removeAvailability}
                                    >
                                        Delete
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={isBusy}
                                        onClick={toggleStatus}
                                    >
                                        {availability.active ? "Deactivate" : "Activate"}
                                    </Button>
                                </div>
                            )}

                            <Button type="submit" disabled={isBusy}>
                                {isBusy && <Spinner data-icon="inline-start" />}
                                {isEdit ? "Save changes" : "Create availability"}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function getDefaultValues(
    availability: DoctorAvailability | undefined,
    doctors: DoctorProfile[],
): AvailabilityFormValues {
    return {
        doctorId: availability?.doctorId ?? doctors[0]?.id ?? 0,
        dayOfWeek: availability?.dayOfWeek ?? "MONDAY",
        startTime: availability ? formatTime(availability.startTime) : "09:00",
        endTime: availability ? formatTime(availability.endTime) : "12:00",
        slotDurationMinutes: availability?.slotDurationMinutes ?? 30,
        availabilityType: availability?.availabilityType ?? "MIXED",
        active: availability?.active ?? true,
    };
}

function getDoctorName(doctor: DoctorProfile): string {
    return `${doctor.doctorFirstName} ${doctor.doctorLastName}`.trim();
}
