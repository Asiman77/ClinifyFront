"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import { useLogout } from "@/features/auth/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";

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
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Sign out"
        title="Sign out"
        aria-busy={logout.isMutating}
        disabled={logout.isMutating}
        onClick={handleLogout}
      >
        {logout.isMutating ? (
          <Spinner />
        ) : (
          <HugeiconsIcon
            icon={Logout01Icon}
            strokeWidth={2}
          />
        )}
      </Button>

      {error && (
        <p role="alert" className="max-w-40 text-right text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
