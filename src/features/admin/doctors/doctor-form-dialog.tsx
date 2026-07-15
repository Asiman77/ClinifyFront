"use client";

import { useState, type ComponentProps } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateDoctor,
    useUpdateDoctor,
} from "@/features/admin/doctors/api";
import {
    doctorFormSchema,
    type DoctorFormValues,
} from "@/features/admin/doctors/schemas";
import type { Department } from "@/types/department";
import type {
    CreateDoctorProfileRequest,
    DoctorProfile,
    UpdateDoctorProfileRequest,
} from "@/types/doctor";

type DoctorFormDialogProps = {
    doctor?: DoctorProfile;
    departments: Department[];
    triggerLabel: string;
    triggerProps?: ComponentProps<typeof Button>;
};

export function DoctorFormDialog({
    doctor,
    departments,
    triggerLabel,
    triggerProps,
}: DoctorFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] =
        useState<string | null>(null);

    const createDoctor = useCreateDoctor();
    const updateDoctor = useUpdateDoctor();
    const isEdit = doctor !== undefined;
    const isBusy =
        createDoctor.isMutating || updateDoctor.isMutating;

    const availableDepartments = departments.filter(
        (department) => department.active || department.id === doctor?.departmentId,
    );

    const departmentItems = Object.fromEntries(
        availableDepartments.map((department) => [
            String(department.id),
            department.name,
        ]),
    );

    const form = useForm<DoctorFormValues>({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: getDefaultValues(
            doctor,
            availableDepartments,
        ),
    });
    const errors = form.formState.errors;
    const submit = form.handleSubmit(async (values) => {
        setServerError(null);
        try {
            if (doctor) {
                const request: UpdateDoctorProfileRequest = {
                    departmentId: values.departmentId,
                    specialization: values.specialization,
                    bio: values.bio || null,
                    experienceYears: values.experienceYears,
                    active: values.active,
                };
                await updateDoctor.trigger({
                    doctorId: doctor.id,
                    request,
                });
            } else {
                const request: CreateDoctorProfileRequest = {
                    userId: values.userId,
                    departmentId: values.departmentId,
                    specialization: values.specialization,
                    bio: values.bio || null,
                    experienceYears: values.experienceYears,
                    active: values.active,
                };
                await createDoctor.trigger(request);
            }
            setOpen(false);
            form.reset(getDefaultValues(doctor, availableDepartments),);
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Doctor could not be saved",);
        }
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                setServerError(null);

                if (nextOpen) {
                    form.reset(
                        getDefaultValues(doctor, availableDepartments,),
                    );
                }
            }}
        >
            <DialogTrigger
                render={
                    <Button type="button" {...triggerProps}>
                        {triggerLabel}
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit doctor" : "Create doctor"}
                    </DialogTitle>
                    <DialogDescription>
                        Manage the doctor profile and department.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} noValidate>
                    <FieldGroup>
                        {!isEdit && (
                            <Field data-invalid={Boolean(errors.userId)} >
                                <FieldLabel htmlFor="doctor-user-id">
                                    User ID
                                </FieldLabel>
                                <Input id="doctor-user-id" type="number" min={1} step={1}
                                    {...form.register("userId", {
                                        valueAsNumber: true,
                                    })}
                                />
                                <FieldError>
                                    {errors.userId?.message}
                                </FieldError>
                            </Field>
                        )}

                        <Controller
                            control={form.control}
                            name="departmentId"
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={Boolean(
                                        fieldState.error,
                                    )}
                                >
                                    <FieldLabel htmlFor="doctor-department">
                                        Department
                                    </FieldLabel>

                                    <Select
                                        items={departmentItems}
                                        value={
                                            field.value > 0 ? String(field.value) : null
                                        }
                                        disabled={
                                            availableDepartments.length === 0
                                        }
                                        onValueChange={(value) => field.onChange(
                                            value ? Number(value) : 0,
                                        )
                                        }
                                    >
                                        <SelectTrigger id="doctor-department" className="w-full" >
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                {availableDepartments.map(
                                                    (department) => (
                                                        <SelectItem
                                                            key={
                                                                department.id
                                                            }
                                                            value={String(
                                                                department.id,
                                                            )}
                                                        >
                                                            {
                                                                department.name
                                                            }
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <FieldError>
                                        {fieldState.error?.message}
                                    </FieldError>
                                </Field>
                            )}
                        />
                        <Field data-invalid={Boolean(errors.specialization,)} >
                            <FieldLabel htmlFor="doctor-specialization"> Specialization </FieldLabel>
                            <Input id="doctor-specialization" {...form.register("specialization")} />
                            <FieldError>
                                {errors.specialization?.message}
                            </FieldError>
                        </Field>

                        <Field data-invalid={Boolean(errors.experienceYears,)} >
                            <FieldLabel htmlFor="doctor-experience">
                                Experience years
                            </FieldLabel>
                            <Input id="doctor-experience" type="number" min={0} step={1}
                                {...form.register(
                                    "experienceYears",
                                    { valueAsNumber: true, },
                                )}
                            />
                            <FieldError>
                                {errors.experienceYears?.message}
                            </FieldError>
                        </Field>
                        <Field data-invalid={Boolean(errors.bio)}>
                            <FieldLabel htmlFor="doctor-bio">
                                Bio
                            </FieldLabel>
                            <Textarea id="doctor-bio" rows={4} {...form.register("bio")} />
                            <FieldError>
                                {errors.bio?.message}
                            </FieldError>
                        </Field>
                        <Field orientation="horizontal">
                            <input id="doctor-active" type="checkbox" className="size-4 accent-primary" {...form.register("active")}
                            />
                            <FieldLabel htmlFor="doctor-active">
                                Active doctor
                            </FieldLabel>
                        </Field>
                        {serverError && (
                            <FieldError>{serverError}</FieldError>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={isBusy}  >
                                {isBusy && (<Spinner data-icon="inline-start" />)}
                                {isEdit ? "Save changes" : "Create doctor"}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function getDefaultValues(
    doctor: DoctorProfile | undefined,
    departments: Department[],
): DoctorFormValues {
    return {
        userId: doctor?.userId ?? 0,
        departmentId: doctor?.departmentId ?? departments[0]?.id ?? 0,
        specialization: doctor?.specialization ?? "",
        bio: doctor?.bio ?? "",
        experienceYears: doctor?.experienceYears ?? 0,
        active: doctor?.active ?? true,
    };
}