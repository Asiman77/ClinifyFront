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
  const [showPassword, setShowPassword] = useState(false); 

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

        
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"} 
              autoComplete="current-password"
              autoFocus
              disabled={login.isMutating}
              aria-invalid={passwordError ? true : undefined}
              className="pr-10" 
              {...form.register("password")}
            />

            <button
              type="button" 
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={login.isMutating}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>

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