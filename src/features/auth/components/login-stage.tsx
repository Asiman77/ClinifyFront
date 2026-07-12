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
    defaultValues: { password: "" },
  });

  const passwordError = form.formState.errors.password;

  const submit = form.handleSubmit(async ({ password }) => {
    setServerError(null);

    try {
      const result = await login.trigger({ fin, password });
      await onSuccess(result);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed");
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <Field data-invalid={passwordError ? true : undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            disabled={login.isMutating}
            aria-invalid={passwordError ? true : undefined}
            {...form.register("password")}
          />

          <FieldError errors={passwordError ? [passwordError] : undefined} />
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <Button type="submit" disabled={login.isMutating}>
          {login.isMutating && <Spinner data-icon="inline-start" />}
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}