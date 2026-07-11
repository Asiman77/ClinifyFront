import { z } from "zod";

import type { PatientAppointmentRequest } from "@/types/appointment";

export const patientAppointmentRequestSchema: z.ZodType<PatientAppointmentRequest> = z.object({
    doctorId: z
        .number()
        .int("Doctor id must be an integer")
        .positive("Doctor id must be positive"),

    startTime: z.iso.datetime({
        local: true,
        error: "Start time must be a valid local date-time",
    }),

    reason: z
        .string()
        .trim()
        .max(1000, "Reason cannot be longer than 1000 characters",)
        .optional(),
})
    .strict();
