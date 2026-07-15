import { z } from "zod";

export const departmentFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Department name is required")
        .max(
            150,
            "Department name cannot exceed 150 characters",
        ),
    description: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters", ),
    active: z.boolean(),
});

export type DepartmentFormValues = z.infer<
    typeof departmentFormSchema
>;