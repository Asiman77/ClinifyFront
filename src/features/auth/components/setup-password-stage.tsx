"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            autoFocus
            disabled={isSubmitting}
            readOnly={passwordCreated}
            aria-invalid={errors.password ? true : undefined}
            {...form.register("password")}
          />

          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>

          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            readOnly={passwordCreated}
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...form.register("confirmPassword")}
          />

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