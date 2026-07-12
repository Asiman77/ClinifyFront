"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
    defaultValues: { fin: "" },
  });

  const finError = form.formState.errors.fin;

  const submit = form.handleSubmit(async ({ fin }) => {
    setServerError(null);

    try {
      const normalizedFin = fin.toUpperCase();
      const result = await checkFin.trigger({ fin: normalizedFin });

      onSuccess(normalizedFin, result.status);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "FIN could not be checked",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <Field data-invalid={finError ? true : undefined}>
          <FieldLabel htmlFor="fin">FIN code</FieldLabel>

          <Input
            id="fin"
            type="text"
            autoComplete="username"
            autoCapitalize="characters"
            autoFocus
            maxLength={7}
            spellCheck={false}
            disabled={checkFin.isMutating}
            className="font-mono tracking-[0.2em] uppercase"
            aria-invalid={finError ? true : undefined}
            {...form.register("fin")}
          />

          <FieldDescription>
            Enter the 7-character FIN code on your ID card.
          </FieldDescription>

          <FieldError errors={finError ? [finError] : undefined} />
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <Button type="submit" disabled={checkFin.isMutating}>
          {checkFin.isMutating && <Spinner data-icon="inline-start" />}
          Continue
        </Button>
      </FieldGroup>
    </form>
  );
}