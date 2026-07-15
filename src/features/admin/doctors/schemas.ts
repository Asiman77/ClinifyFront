import { z } from "zod";

export const doctorFormSchema = z.object({
    userId: z
        .number()
        .int("User id must be an integer")
        .positive("Enter a valid user id"),
    departmentId: z
        .number()
        .int("Department id must be an integer")
        .positive("Select a department"),
    specialization: z
        .string()
        .trim()
        .min(1, "Specialization is required")
        .max(
            100,
            "Specialization cannot exceed 100 characters",
        ),
    bio: z
        .string()
        .trim()
        .max(2000, "Bio cannot exceed 2000 characters"),
    experienceYears: z
        .number()
        .int("Experience years must be a whole number")
        .min(0, "Experience years cannot be negative"),
    active: z.boolean(),
});

export type DoctorFormValues = z.infer<
    typeof doctorFormSchema
>;