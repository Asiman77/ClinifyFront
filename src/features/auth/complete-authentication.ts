"use client";

import type { LoginResponse, Role, SelectRoleResponse } from "@/types/auth";

function isSafeInternalPath(path: unknown): path is string {
  return (
    typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
  );
}

export async function selectRole(role: Role): Promise<string> {
  const response = await fetch("/api/auth/select-role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ role }),
  });

  const data = (await response.json()) as Partial<SelectRoleResponse> & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message ?? "Role selection failed");
  }

  if (!isSafeInternalPath(data.dashboard)) {
    throw new Error("Invalid dashboard destination");
  }

  return data.dashboard;
}

export async function completeAuthentication(
  result: LoginResponse,
): Promise<string> {
  if (result.roles.length === 0) {
    throw new Error("No role is assigned to this account");
  }

  if (result.roles.length === 1) {
    return selectRole(result.roles[0]);
  }
  return "/select-role";
}
