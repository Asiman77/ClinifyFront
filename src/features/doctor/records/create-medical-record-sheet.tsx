"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMedicalRecord } from "@/features/doctor/records/api";
import { MedicalRecordLabTests } from "@/features/doctor/records/medical-record-lab-tests";
import {
    createMedicalRecordRequestSchema,
    medicalRecordFormSchema,
    type MedicalRecordFormValues,
} from "@/features/doctor/records/schemas";
import type { DoctorPatient } from "@/features/doctor/records/types";

type CreateMedicalRecordSheetProps = {
    patients: DoctorPatient[];
    triggerLabel?: string;
};

export function CreateMedicalRecordSheet({
    patients,
    triggerLabel = "New medical record",
}: CreateMedicalRecordSheetProps) {
    const router = useRouter();
    const createRecord = useCreateMedicalRecord();
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const form = useForm<MedicalRecordFormValues>({
        resolver: zodResolver(medicalRecordFormSchema),
        defaultValues: {
            patientId: patients[0]?.id ?? 0,
            diagnosis: "",
            symptoms: "",
            receipt: "",
            labTests: [],
        },
    });
    const submit = form.handleSubmit(async (values) => {
        setServerError(null);

        try {
            const request = createMedicalRecordRequestSchema.parse(values);
            const record = await createRecord.trigger(request);
            setOpen(false);
            form.reset();
            router.push(`/doctor/medical-records/${record.id}`);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Medical record could not be created",
            );
        }
    });

    const patientItems = Object.fromEntries(
        patients.map((patient) => [
            String(patient.id),
            `${patient.firstName} ${patient.lastName}`,
        ]),
    );

    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                setServerError(null);
                if (nextOpen && patients[0]) {
                    form.setValue("patientId", patients[0].id);
                }
            }}
        >
            <SheetTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={patients.length === 0}
                    >
                        {triggerLabel}
                    </Button>
                }
            />

            <SheetContent className="overflow-y-auto sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Create medical record</SheetTitle>
                    <SheetDescription>
                        Add a diagnosis and optional laboratory requests.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={submit}
                    noValidate
                    className="flex flex-col gap-6 px-6 pb-6"
                >
                    <FieldGroup>
                        <Field
                            data-invalid={
                                form.formState.errors.patientId
                                    ? true
                                    : undefined
                            }
                        >
                            <FieldLabel htmlFor="record-patient">
                                Patient
                            </FieldLabel>
                            <Controller
                                control={form.control}
                                name="patientId"
                                render={({ field }) => (
                                    <Select
                                        items={patientItems}
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger
                                            id="record-patient"
                                            className="w-full"
                                            aria-label="Patient"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {patients.map((patient) => (
                                                    <SelectItem
                                                        key={patient.id}
                                                        value={String(patient.id)}
                                                    >
                                                        {patient.firstName}{" "}
                                                        {patient.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError
                                errors={
                                    form.formState.errors.patientId
                                        ? [form.formState.errors.patientId]
                                        : undefined
                                }
                            />
                        </Field>

                        <Field
                            data-invalid={
                                form.formState.errors.diagnosis
                                    ? true
                                    : undefined
                            }
                        >
                            <FieldLabel htmlFor="record-diagnosis">
                                Diagnosis
                            </FieldLabel>
                            <Input
                                id="record-diagnosis"
                                aria-invalid={
                                    form.formState.errors.diagnosis
                                        ? true
                                        : undefined
                                }
                                {...form.register("diagnosis")}
                            />
                            <FieldError
                                errors={
                                    form.formState.errors.diagnosis
                                        ? [form.formState.errors.diagnosis]
                                        : undefined
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="record-symptoms">
                                Symptoms
                            </FieldLabel>
                            <Textarea
                                id="record-symptoms"
                                rows={3}
                                {...form.register("symptoms")}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="record-receipt">
                                Prescription and recommendations
                            </FieldLabel>
                            <Textarea
                                id="record-receipt"
                                rows={3}
                                {...form.register("receipt")}
                            />
                        </Field>

                        <MedicalRecordLabTests form={form} />

                        {serverError && (
                            <FieldError>{serverError}</FieldError>
                        )}

                        <Button
                            type="submit"
                            disabled={createRecord.isMutating}
                        >
                            {createRecord.isMutating && (
                                <Spinner data-icon="inline-start" />
                            )}
                            Create medical record
                        </Button>
                    </FieldGroup>
                </form>
            </SheetContent>
        </Sheet>
    );
}
