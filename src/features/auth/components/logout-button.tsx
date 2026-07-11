"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import { useLogout } from "@/features/auth/api";

export function LogoutButton() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const logout = useLogout();

  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);

    try {
      await logout.trigger();

      await mutate("/api/auth/me", undefined, {
        revalidate: false,
      });

      router.replace("/auth");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={logout.isMutating}
        aria-busy={logout.isMutating}
      >
        {logout.isMutating ? "Signing out..." : "Sign out"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
