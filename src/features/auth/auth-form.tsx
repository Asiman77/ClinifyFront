"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FinStage } from "@/features/auth/components/fin-stage";
import { LoginStage } from "@/features/auth/components/login-stage";
import { SetupPasswordStage } from "@/features/auth/components/setup-password-stage";
import { VerifyStage } from "@/features/auth/components/verify-stage";
import { completeAuthentication } from "@/features/auth/complete-authentication";
import type { CheckFinStatus, LoginResponse } from "@/types/auth";

type AuthStage = "fin" | "login" | "verify" | "setup-password";

export function AuthForm() {
  const router = useRouter();
  const [stage, setStage] = useState<AuthStage>("fin");
  const [fin, setFin] = useState("");

  function handleFinSuccess(normalizedFin: string, status: CheckFinStatus) {
    setFin(normalizedFin);

    if (status === "LOGIN_REQUIRED") {
      setStage("login");
      return;
    }

    setStage("verify");
  }

  async function handleAuthenticated(result: LoginResponse) {
    const destination = await completeAuthentication(result);

    router.replace(destination);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {stage !== "fin" && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-1.5">
          <span className="font-mono text-sm tracking-[0.2em]">{fin}</span>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setStage("fin")}
          >
            Change
          </Button>
        </div>
      )}

      <div
        key={stage}
        className="transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none starting:translate-y-1 starting:opacity-0"
      >
        {stage === "fin" && <FinStage onSuccess={handleFinSuccess} />}

        {stage === "login" && (
          <LoginStage fin={fin} onSuccess={handleAuthenticated} />
        )}

        {stage === "verify" && (
          <VerifyStage
            fin={fin}
            onSuccess={() => setStage("setup-password")}
          />
        )}

        {stage === "setup-password" && (
          <SetupPasswordStage fin={fin} onSuccess={handleAuthenticated} />
        )}
      </div>
    </div>
  );
}