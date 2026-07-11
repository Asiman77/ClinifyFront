"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

  const submit = form.handleSubmit(async ({ password }) => {
    setServerError(null);

    try {
      if (!passwordCreated) {
        await setupPassword.trigger({
          fin,
          password,
        });

        setPasswordCreated(true);
      }

      const loginResult = await login.trigger({
        fin,
        password,
      });

      await onSuccess(loginResult);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Password setup failed",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <h2>Şifrə yarat</h2>

      <p>
        FIN: <strong>{fin}</strong>
      </p>

      <label htmlFor="new-password">Yeni şifrə</label>

      <input
        id="new-password"
        type="password"
        autoComplete="new-password"
        disabled={isSubmitting || passwordCreated}
        aria-invalid={form.formState.errors.password ? "true" : "false"}
        aria-describedby={
          form.formState.errors.password ? "new-password-error" : undefined
        }
        {...form.register("password")}
      />

      {form.formState.errors.password && (
        <p id="new-password-error" role="alert">
          {form.formState.errors.password.message}
        </p>
      )}

      <label htmlFor="confirm-password">Şifrə təkrarı</label>

      <input
        id="confirm-password"
        type="password"
        autoComplete="new-password"
        disabled={isSubmitting || passwordCreated}
        aria-invalid={form.formState.errors.confirmPassword ? "true" : "false"}
        aria-describedby={
          form.formState.errors.confirmPassword
            ? "confirm-password-error"
            : undefined
        }
        {...form.register("confirmPassword")}
      />

      {form.formState.errors.confirmPassword && (
        <p id="confirm-password-error" role="alert">
          {form.formState.errors.confirmPassword.message}
        </p>
      )}

      {passwordCreated && serverError && (
        <p role="status">
          Şifrə yaradıldı, amma giriş baş tutmadı. Yenidən cəhd edin.
        </p>
      )}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Davam edir..."
          : passwordCreated
            ? "Yenidən daxil ol"
            : "Şifrəni yarat"}
      </button>
    </form>
  );
}
