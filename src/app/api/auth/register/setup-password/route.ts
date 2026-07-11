import { NextResponse } from "next/server";

import { setupPasswordRequestSchema } from "@/features/auth/schemas";
import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { SetupPasswordResponse } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedBody = setupPasswordRequestSchema.parse(requestBody);

    const message = await backendFetch<string>(
      "/api/auth/register/setup-password",
      {
        method: "POST",
        body: JSON.stringify({
          fin: validatedBody.fin.toUpperCase(),
          password: validatedBody.password,
        }),
      },
    );

    const response: SetupPasswordResponse = {
      registered: true,
      message,
    };

    return NextResponse.json(response);
  } catch (error) {
    return createRouteErrorResponse(error, "Password setup failed");
  }
}
