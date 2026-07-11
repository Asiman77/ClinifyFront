"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCheckFin } from "@/features/auth/api";
import { finSchema, type FinFormValues } from "@/features/auth/schemas";
import type { CheckFinStatus } from "@/types/auth";

type FinStageProps = {
  onSuccess: (fin: string, status: CheckFinStatus) => void;
};

export function FinStage({ onSuccess }: FinStageProps) {
  const checkFin = useCheckFin();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FinFormValues>({
    resolver: zodResolver(finSchema),
    defaultValues: {
      fin: "",
    },
  });

  const submit = form.handleSubmit(async ({ fin }) => {
    setServerError(null);

    const normalizedFin = fin.toUpperCase();

    try {
      const result = await checkFin.trigger({
        fin: normalizedFin,
      });

      onSuccess(normalizedFin, result.status);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "FIN could not be checked",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <h2>FIN ilə giriş</h2>

      <label htmlFor="fin">FIN</label>

      <input
        id="fin"
        type="text"
        autoComplete="username"
        autoCapitalize="characters"
        maxLength={7}
        disabled={checkFin.isMutating}
        aria-invalid={form.formState.errors.fin ? "true" : "false"}
        aria-describedby={form.formState.errors.fin ? "fin-error" : undefined}
        {...form.register("fin")}
      />

      {form.formState.errors.fin && (
        <p id="fin-error" role="alert">
          {form.formState.errors.fin.message}
        </p>
      )}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={checkFin.isMutating}>
        {checkFin.isMutating ? "Checking..." : "Continue"}
      </button>
    </form>
  );
}
