"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/features/auth/api";
import { selectRole } from "@/features/auth/complete-authentication";
import type { Role } from "@/types/auth";

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor",
  PATIENT: "Patient",
  LAB_TECHNICIAN: "Lab technician",
  RECEPTION: "Reception",
};

function RolePageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Clinify
        </Link>

        <ThemeSwitcher />
      </header>

      <main className="flex flex-1 justify-center px-6 pt-[16svh] pb-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}

function ReturnToSignIn() {
  return (
    <Button render={<Link href="/auth" />} nativeButton={false}>
      Return to sign in
    </Button>
  );
}

export default function SelectRolePage() {
  const router = useRouter();
  const { data: user, error: userError, isLoading } = useCurrentUser();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  async function handleRoleSelection(role: Role) {
    setSelectedRole(role);
    setSelectionError(null);

    try {
      const destination = await selectRole(role);

      router.replace(destination);
      router.refresh();
    } catch (error) {
      setSelectionError(
        error instanceof Error ? error.message : "Role selection failed",
      );
      setSelectedRole(null);
    }
  }

  if (isLoading) {
    return (
      <RolePageShell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          <p role="status">Loading roles...</p>
        </div>
      </RolePageShell>
    );
  }

  if (userError || !user) {
    return (
      <RolePageShell>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Session not found
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in again before selecting a role.
            </p>
          </div>

          <ReturnToSignIn />
        </div>
      </RolePageShell>
    );
  }

  if (user.roles.length === 0) {
    return (
      <RolePageShell>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              No role assigned
            </h1>
            <p role="alert" className="mt-1 text-sm text-muted-foreground">
              No role has been assigned to your account.
            </p>
          </div>

          <ReturnToSignIn />
        </div>
      </RolePageShell>
    );
  }

  return (
    <RolePageShell>
      <h1 className="text-xl font-semibold tracking-tight">Choose a role</h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Choose how you want to continue in Clinify.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {user.roles.map((role) => (
          <Button
            key={role}
            type="button"
            variant="outline"
            size="lg"
            disabled={selectedRole !== null}
            aria-busy={selectedRole === role}
            onClick={() => handleRoleSelection(role)}
          >
            {ROLE_LABELS[role]}
            {selectedRole === role && <Spinner data-icon="inline-end" />}
          </Button>
        ))}
      </div>

      {selectionError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {selectionError}
        </p>
      )}
    </RolePageShell>
  );
}