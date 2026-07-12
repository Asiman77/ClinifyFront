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
import { useVerifyIdentity } from "@/features/auth/api";
import { verifySchema, type VerifyFormValues } from "@/features/auth/schemas";

type VerifyStageProps = {
  fin: string;
  onSuccess: () => void;
};

export function VerifyStage({ fin, onSuccess }: VerifyStageProps) {
  const verifyIdentity = useVerifyIdentity();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { signature: "" },
  });

  const signatureError = form.formState.errors.signature;

  const submit = form.handleSubmit(async ({ signature }) => {
    setServerError(null);

    try {
      const result = await verifyIdentity.trigger({
        fin,
        password: signature,
      });

      if (!result.verified) {
        setServerError("Identity could not be verified");
        return;
      }

      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Identity verification failed",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">Verify your identity</h2>
          <p className="text-sm text-muted-foreground">
            Enter your verification signature to continue registration.
          </p>
        </div>

        <Field data-invalid={signatureError ? true : undefined}>
          <FieldLabel htmlFor="signature">Signature</FieldLabel>

          <Input
            id="signature"
            type="password"
            autoComplete="off"
            autoFocus
            disabled={verifyIdentity.isMutating}
            aria-invalid={signatureError ? true : undefined}
            {...form.register("signature")}
          />

          <FieldError errors={signatureError ? [signatureError] : undefined} />
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <Button type="submit" disabled={verifyIdentity.isMutating}>
          {verifyIdentity.isMutating && <Spinner data-icon="inline-start" />}
          Verify
        </Button>
      </FieldGroup>
    </form>
  );
}