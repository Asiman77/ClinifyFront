import { NextResponse } from "next/server";

import { verifyIdentityRequestSchema } from "@/features/auth/schemas";
import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { VerifyIdentityResponse } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedBody = verifyIdentityRequestSchema.parse(requestBody);

    const data = await backendFetch<VerifyIdentityResponse>(
      "/api/auth/register/verify",
      {
        method: "POST",
        body: JSON.stringify({
          fin: validatedBody.fin.toUpperCase(),
          password: validatedBody.password,
        }),
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    return createRouteErrorResponse(error, "Failed to verify identity");
  }
}
