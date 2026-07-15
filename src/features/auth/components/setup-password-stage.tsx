"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLogin, useSetupPassword } from "@/features/auth/api";
import {
  setupPasswordSchema,
  type SetupPasswordFormValues,
} from "@/features/auth/schemas";
import type { LoginResponse } from "@/types/auth";

type SetupPasswordStageProps = {
  fin: string;
  onSuccess: (result: LoginResponse) => Promise<void>;
};

export function SetupPasswordStage({
  fin,
  onSuccess,
}: SetupPasswordStageProps) {
  const setupPassword = useSetupPassword();
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordCreated, setPasswordCreated] = useState(false);
  
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetupPasswordFormValues>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = setupPassword.isMutating || login.isMutating;
  const { errors } = form.formState;

  const submit = form.handleSubmit(async ({ password }) => {
    setServerError(null);

    try {
      if (!passwordCreated) {
        await setupPassword.trigger({ fin, password });
        setPasswordCreated(true);
      }

      const loginResult = await login.trigger({ fin, password });
      await onSuccess(loginResult);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Password setup failed",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">Create a password</h2>
          <p className="text-sm text-muted-foreground">
            Use at least 8 characters for your Clinify password.
          </p>
        </div>

       
        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="new-password">Password</FieldLabel>

          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              autoFocus
              disabled={isSubmitting}
              readOnly={passwordCreated}
              aria-invalid={errors.password ? true : undefined}
              className="pr-10" 
              {...form.register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={isSubmitting || passwordCreated}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>

          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

       
        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>

          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={isSubmitting}
              readOnly={passwordCreated}
              aria-invalid={errors.confirmPassword ? true : undefined}
              className="pr-10" // Sağdan boşluq
              {...form.register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={isSubmitting || passwordCreated}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>

          <FieldError
            errors={
              errors.confirmPassword ? [errors.confirmPassword] : undefined
            }
          />
        </Field>

        {passwordCreated && serverError && (
          <p role="status" className="text-sm text-muted-foreground">
            Your password was created, but sign-in failed. Try again.
          </p>
        )}

        {serverError && <FieldError>{serverError}</FieldError>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {passwordCreated ? "Sign in again" : "Create password"}
        </Button>
      </FieldGroup>
    </form>
  );
}