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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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

type CreateMedicalRecordDialogProps = {
    patients: DoctorPatient[];
    triggerLabel?: string;
};

export function CreateMedicalRecordDialog({
    patients,
    triggerLabel = "New medical record",
}: CreateMedicalRecordDialogProps) {
    const router = useRouter();
    const createRecord = useCreateMedicalRecord();
    const [patientInput, setPatientInput] = useState("");
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const form = useForm<MedicalRecordFormValues>({
        resolver: zodResolver(medicalRecordFormSchema),
        defaultValues: {
            patientId: 0,
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
            setPatientInput("");
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
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                setServerError(null);

                if (nextOpen) {
                    setPatientInput("");
                    form.reset({
                        patientId: 0,
                        diagnosis: "",
                        symptoms: "",
                        receipt: "",
                        labTests: [],
                    });
                }
            }}
        >
            <DialogTrigger
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

            <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create medical record</DialogTitle>
                    <DialogDescription>
                        Add a diagnosis and optional laboratory requests.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={submit}
                    noValidate
                    className="flex flex-col gap-6"
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
                                    <>
                                        <Input
                                            id="record-patient"
                                            list="doctor-patient-options"
                                            value={patientInput}
                                            placeholder="Type patient name or email"
                                            autoComplete="off"
                                            onBlur={field.onBlur}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                const patient = findPatient(patients, value);

                                                setPatientInput(value);
                                                field.onChange(patient?.id ?? 0);
                                            }}
                                            aria-invalid={
                                                form.formState.errors.patientId
                                                    ? true
                                                    : undefined
                                            }
                                        />

                                        <datalist id="doctor-patient-options">
                                            {patients.map((patient) => (
                                                <option
                                                    key={patient.id}
                                                    value={getPatientLabel(patient)}
                                                />
                                            ))}
                                        </datalist>
                                    </>
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
            </DialogContent>
        </Dialog>
    );
}
function getPatientName(patient: DoctorPatient): string {
    return `${patient.firstName} ${patient.lastName}`.trim();
}

function getPatientLabel(patient: DoctorPatient): string {
    const name = getPatientName(patient);

    return patient.email
        ? `${name} (${patient.email})`
        : name;
}

function findPatient(
    patients: DoctorPatient[],
    value: string,
): DoctorPatient | undefined {
    const normalized = value.trim().toLowerCase();

    const directMatch = patients.find((patient) => {
        return (
            getPatientLabel(patient).toLowerCase() === normalized ||
            patient.email?.toLowerCase() === normalized
        );
    });

    if (directMatch) {
        return directMatch;
    }

    const nameMatches = patients.filter(
        (patient) =>
            getPatientName(patient).toLowerCase() === normalized,
    );

    return nameMatches.length === 1
        ? nameMatches[0]
        : undefined;
}