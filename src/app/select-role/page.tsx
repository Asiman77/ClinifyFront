"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { selectRole } from "@/features/auth/complete-authentication";
import { useCurrentUser } from "@/features/auth/api";
import type { Role } from "@/types/auth";

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
      <main>
        <p role="status">Rollar yüklənir...</p>
      </main>
    );
  }

  if (userError || !user) {
    return (
      <main>
        <h1>Session tapılmadı</h1>

        <p>Role seçmək üçün yenidən daxil olun.</p>

        <Link href="/auth">Giriş səhifəsinə qayıt</Link>
      </main>
    );
  }

  if (user.roles.length === 0) {
    return (
      <main>
        <h1>Role mövcud deyil</h1>

        <p role="alert">Hesabınıza heç bir role təyin edilməyib.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Role seçin</h1>

      <p>Davam etmək istədiyiniz role-u seçin.</p>

      <div>
        {user.roles.map((role) => (
          <button
            key={role}
            type="button"
            disabled={selectedRole !== null}
            aria-busy={selectedRole === role}
            onClick={() => handleRoleSelection(role)}
          >
            {selectedRole === role
              ? "Davam edir..."
              : role.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {selectionError && <p role="alert">{selectionError}</p>}
    </main>
  );
}
