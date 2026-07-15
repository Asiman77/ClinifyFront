import { z } from "zod";

import {
    AVAILABILITY_TYPES,
    DAYS_OF_WEEK,
} from "@/types/availability";

const TIME_PATTERN =
    /^([01]\d|2[0-3]):[0-5]\d$/;

export const availabilityFormSchema = z
    .object({
        doctorId: z
            .number()
            .int("Doctor id must be an integer")
            .positive("Select a doctor"),
        dayOfWeek: z.enum(DAYS_OF_WEEK),
        startTime: z
            .string()
            .regex(
                TIME_PATTERN,
                "Enter a valid start time",
            ),
        endTime: z
            .string()
            .regex(TIME_PATTERN, "Enter a valid end time",
            ),
        slotDurationMinutes: z
            .number()
            .int("Slot duration must be a whole number")
            .min(
                5,
                "Slot duration must be at least 5 minutes",
            )
            .multipleOf(
                5,
                "Slot duration must use 5-minute increments",
            ),
        availabilityType: z.enum(
            AVAILABILITY_TYPES,
        ),
        active: z.boolean(),
    })
    .superRefine((values, context) => {
        const startMinutes = toMinutes(
            values.startTime,
        );
        const endMinutes = toMinutes(values.endTime);

        if (endMinutes <= startMinutes) {
            context.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after start time",
            });

            return;
        }

        if (values.slotDurationMinutes > endMinutes - startMinutes) {
            context.addIssue({
                code: "custom",
                path: ["slotDurationMinutes"],
                message: "Slot duration cannot exceed the availability window",
            });
        }
    });

export type AvailabilityFormValues = z.infer< typeof availabilityFormSchema >;

function toMinutes(time: string): number {
    const [hours, minutes] = time
        .split(":")
        .map(Number);

    return hours * 60 + minutes;
}