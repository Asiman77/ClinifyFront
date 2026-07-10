import { z } from "zod";

export const finSchema = z.object({
  fin: z
    .string()
    .trim()
    .min(1, "FIN is required")
    .regex(/^[A-Za-z0-9]{7}$/, "FIN must be exactly 7 characters"),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const verifySchema = z.object({
  signature: z.string().trim().min(1, "Signature is required"),
});

export const setupPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type FinFormValues = z.infer<typeof finSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyFormValues = z.infer<typeof verifySchema>;
export type SetupPasswordFormValues = z.infer<typeof setupPasswordSchema>;
