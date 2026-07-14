import { NextResponse } from "next/server";
import { z } from "zod";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import {
    LAB_STATUSES,
    type LabResponse,
} from "@/types/lab";

const responseIdSchema = z.coerce
    .number()
    .int("Lab response id must be an integer")
    .positive("Lab response id must be positive");

const statusRequestSchema = z.object({
    status: z.enum(LAB_STATUSES),
});

type StatusRouteContext = {
    params: Promise<{
        responseId: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: StatusRouteContext,
) {
    try {
        const routeParams = await params;
        const responseId = responseIdSchema.parse(
            routeParams.responseId,
        );

        const requestBody = await request.json();
        const validatedBody =
            statusRequestSchema.parse(requestBody);

        const { data, status, setCookies } =
            await backendRequest<LabResponse>(
                `/api/lab-responses/${responseId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        cookie:
                            request.headers.get("cookie") ?? "",
                    },
                    body: JSON.stringify(validatedBody),
                    cache: "no-store",
                },
            );

        const response = NextResponse.json(data, { status });

        for (const cookie of setCookies) {
            response.headers.append("Set-Cookie", cookie);
        }

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Lab response status could not be updated",
        );
    }
}