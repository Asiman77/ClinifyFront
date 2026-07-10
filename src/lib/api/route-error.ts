import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { BackendError } from "./backend";

export function createRouteErrorResponse(
  error: unknown,
  fallbackMessage = "Unexpected server error",
) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Invalid request data",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (error instanceof BackendError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  console.error(fallbackMessage, error);

  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
