import { NextResponse } from "next/server";

import { backendRequest } from "@/lib/api/backend";
import type { LogoutResponse } from "@/types/auth";

export async function POST(request: Request) {
  let backendCookies: string[] = [];

  try {
    const result = await backendRequest<void>("/api/auth/logout", {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    backendCookies = result.setCookies;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown backend logout error";

    console.error("Backend logout failed:", message);
  }

  const body: LogoutResponse = {
    message: "Logout successful",
  };

  const response = NextResponse.json(body);

  for (const cookie of backendCookies) {
    response.headers.append("Set-Cookie", cookie);
  }

  response.cookies.delete("token");
  response.cookies.delete("clinify_roles");
  response.cookies.delete("clinify_role");

  return response;
}
