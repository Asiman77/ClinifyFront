import { NextResponse } from "next/server";

import { loginRequestSchema } from "@/features/auth/schemas";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { LoginResponse } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedBody = loginRequestSchema.parse(requestBody);

    const { data, setCookies } = await backendRequest<LoginResponse>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          fin: validatedBody.fin.toUpperCase(),
          password: validatedBody.password,
        }),
      },
    );

    const response = NextResponse.json({
      fin: data.fin,
      roles: data.roles,
    });

    response.cookies.set("clinify_roles", JSON.stringify(data.roles), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.delete("clinify_role");

    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    return createRouteErrorResponse(error, "Login failed");
  }
}
