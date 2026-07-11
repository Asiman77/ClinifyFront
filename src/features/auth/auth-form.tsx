"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { completeAuthentication } from "@/features/auth/complete-authentication";
import { FinStage } from "@/features/auth/components/fin-stage";
import { LoginStage } from "@/features/auth/components/login-stage";
import { SetupPasswordStage } from "@/features/auth/components/setup-password-stage";
import { VerifyStage } from "@/features/auth/components/verify-stage";
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
    <div>
      {stage === "fin" && <FinStage onSuccess={handleFinSuccess} />}

      {stage === "login" && (
        <LoginStage fin={fin} onSuccess={handleAuthenticated} />
      )}

      {stage === "verify" && (
        <VerifyStage fin={fin} onSuccess={() => setStage("setup-password")} />
      )}

      {stage === "setup-password" && (
        <SetupPasswordStage fin={fin} onSuccess={handleAuthenticated} />
      )}
    </div>
  );
}
