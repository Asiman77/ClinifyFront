import { NextResponse } from "next/server";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { CurrentUser } from "@/types/auth";

export async function GET(request: Request) {
  try {
    const { data: user, setCookies } = await backendRequest<CurrentUser>(
      "/api/auth/me",
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      },
    );

    const response = NextResponse.json(user);

    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    return createRouteErrorResponse(error, "User could not be loaded");
  }
}
