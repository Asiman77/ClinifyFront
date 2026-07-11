import { NextResponse } from "next/server";

import { getDashboardForRole } from "@/features/auth/roles";
import { selectRoleRequestSchema } from "@/features/auth/schemas";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { CurrentUser, SelectRoleResponse } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { role } = selectRoleRequestSchema.parse(requestBody);

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

    if (!user.roles.includes(role)) {
      return NextResponse.json(
        {
          message: "You do not have permission to use this role",
        },
        { status: 403 },
      );
    }

    const body: SelectRoleResponse = {
      dashboard: getDashboardForRole(role),
    };

    const response = NextResponse.json(body);

    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    response.cookies.set("clinify_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.delete("clinify_roles");

    return response;
  } catch (error) {
    return createRouteErrorResponse(error, "Role selection failed");
  }
}
