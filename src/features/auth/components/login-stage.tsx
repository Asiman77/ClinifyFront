"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLogin } from "@/features/auth/api";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import type { LoginResponse } from "@/types/auth";

type LoginStageProps = {
  fin: string;
  onSuccess: (result: LoginResponse) => Promise<void>;
};

export function LoginStage({ fin, onSuccess }: LoginStageProps) {
  const login = useLogin();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const submit = form.handleSubmit(async ({ password }) => {
    setServerError(null);

    try {
      const result = await login.trigger({
        fin,
        password,
      });

      await onSuccess(result);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed");
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <h2>Şifrə ilə giriş</h2>

      <p>
        FIN: <strong>{fin}</strong>
      </p>

      <label htmlFor="password">Şifrə</label>

      <input
        id="password"
        type="password"
        autoComplete="current-password"
        disabled={login.isMutating}
        aria-invalid={form.formState.errors.password ? "true" : "false"}
        aria-describedby={
          form.formState.errors.password ? "password-error" : undefined
        }
        {...form.register("password")}
      />

      {form.formState.errors.password && (
        <p id="password-error" role="alert">
          {form.formState.errors.password.message}
        </p>
      )}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={login.isMutating}>
        {login.isMutating ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
