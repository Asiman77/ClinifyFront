import { z } from "zod";

export const medicalRecordFormSchema = z.object({
    patientId: z.number().int().positive("Patient is required"),
    diagnosis: z
        .string()
        .trim()
        .min(1, "Diagnosis is required")
        .max(255, "Diagnosis cannot exceed 255 characters"),
    symptoms: z
        .string()
        .max(2000, "Symptoms cannot exceed 2000 characters"),
    receipt: z
        .string()
        .max(2000, "Receipt cannot exceed 2000 characters"),
    labTests: z.array(
        z.object({
            testName: z
                .string()
                .trim()
                .min(1, "Test name is required")
                .max(255, "Test name cannot exceed 255 characters"),
            note: z
                .string()
                .max(2000, "Note cannot exceed 2000 characters"),
        }),
    ),
});

export const createMedicalRecordRequestSchema =
    medicalRecordFormSchema.transform((values) => ({
        patientId: values.patientId,
        diagnosis: values.diagnosis.trim(),
        ...(values.symptoms.trim()
            ? { symptoms: values.symptoms.trim() }
            : {}),
        ...(values.receipt.trim()
            ? { receipt: values.receipt.trim() }
            : {}),
        labTests: values.labTests.map((test) => ({
            testName: test.testName.trim(),
            ...(test.note.trim() ? { note: test.note.trim() } : {}),
        })),
    }));

export type MedicalRecordFormValues = z.input<
    typeof medicalRecordFormSchema
>;
