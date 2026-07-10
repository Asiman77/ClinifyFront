import { NextResponse } from "next/server";

import { finSchema } from "@/features/auth/schemas";
import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { CheckFinResponse } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedBody = finSchema.parse(requestBody);

    const data = await backendFetch<CheckFinResponse>("/api/auth/check-fin", {
      method: "POST",
      body: JSON.stringify({
        fin: validatedBody.fin.toUpperCase(),
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return createRouteErrorResponse(error, "Failed to check FIN");
  }
}
