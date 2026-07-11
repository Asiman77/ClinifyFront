"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
    defaultValues: {
      signature: "",
    },
  });

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
        error instanceof Error ? error.message : "Identity verification failed",
      );
    }
  });

  return (
    <form onSubmit={submit} noValidate>
      <h2>Qeydiyyat təsdiqi</h2>

      <p>
        FIN: <strong>{fin}</strong>
      </p>

      <label htmlFor="signature">Mock imza</label>

      <input
        id="signature"
        type="password"
        autoComplete="off"
        disabled={verifyIdentity.isMutating}
        aria-invalid={form.formState.errors.signature ? "true" : "false"}
        aria-describedby={
          form.formState.errors.signature ? "signature-error" : undefined
        }
        {...form.register("signature")}
      />

      {form.formState.errors.signature && (
        <p id="signature-error" role="alert">
          {form.formState.errors.signature.message}
        </p>
      )}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={verifyIdentity.isMutating}>
        {verifyIdentity.isMutating ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
