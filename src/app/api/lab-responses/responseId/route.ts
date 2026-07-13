import { NextResponse } from "next/server";
import { z } from "zod";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import {
    LAB_STATUSES,
    type LabResponse,
    type LabResponseDetail,
} from "@/types/lab";

const responseIdSchema = z.coerce
    .number()
    .int("Lab response id must be an integer")
    .positive("Lab response id must be positive");

const updateSchema = z
    .object({
        resultText: z.string().max(5000).optional(),
        note: z.string().max(2000).optional(),
        status: z.enum(LAB_STATUSES).optional(),
    })
    .refine(
        (data) =>
            data.resultText !== undefined ||
            data.note !== undefined ||
            data.status !== undefined,
        {
            message: "At least one field is required",
        },
    );

type LabResponseRouteContext = {
    params: Promise<{
        responseId: string;
    }>;
};

export async function GET(
    request: Request,
    { params }: LabResponseRouteContext,
) {
    try {
        const routeParams = await params;
        const responseId = responseIdSchema.parse(
            routeParams.responseId,
        );

        const { data, status, setCookies } =
            await backendRequest<LabResponseDetail>(
                `/api/lab-responses/${responseId}`,
                {
                    method: "GET",
                    headers: {
                        cookie:
                            request.headers.get("cookie") ?? "",
                    },
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
            "Lab response could not be loaded",
        );
    }
}

export async function PUT(
    request: Request,
    { params }: LabResponseRouteContext,
) {
    try {
        const routeParams = await params;
        const responseId = responseIdSchema.parse(
            routeParams.responseId,
        );

        const requestBody = await request.json();
        const validatedBody = updateSchema.parse(requestBody);

        const { data, status, setCookies } =
            await backendRequest<LabResponse>(
                `/api/lab-responses/${responseId}`,
                {
                    method: "PUT",
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
            "Lab response could not be updated",
        );
    }
}