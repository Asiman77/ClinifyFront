import { NextResponse } from "next/server";
import { z } from "zod";

import type { MedicalRecord } from "@/features/doctor/records/types";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";

const recordIdSchema = z.coerce.number().int().positive();

type RecordRouteContext = {
    params: Promise<{ recordId: string }>;
};

export async function GET(
    request: Request,
    { params }: RecordRouteContext,
) {
    try {
        const routeParams = await params;
        const recordId = recordIdSchema.parse(routeParams.recordId);
        const { data, status, setCookies } =
            await backendRequest<MedicalRecord>(
                `/api/records/doctor/mine/${recordId}`,
                {
                    method: "GET",
                    headers: {
                        cookie: request.headers.get("cookie") ?? "",
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
            "Medical record could not be loaded",
        );
    }
}
