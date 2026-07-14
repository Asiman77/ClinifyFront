import { NextResponse } from "next/server";
import { z } from "zod";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { MedicalRecordSummary } from "@/types/medical-record";
import type { PageResponse } from "@/types/pagination";

const querySchema = z.object({
    page: z.coerce.number().int().min(0).optional(),
    size: z.coerce.number().int().min(1).max(100).optional(),
    sort: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);

        const query = querySchema.parse(
            Object.fromEntries(requestUrl.searchParams),
        );

        const searchParams = new URLSearchParams();

        if (query.page !== undefined) {
            searchParams.set("page", String(query.page));
        }

        if (query.size !== undefined) {
            searchParams.set("size", String(query.size));
        }

        if (query.sort) {
            searchParams.set("sort", query.sort);
        }

        const queryString = searchParams.toString();

        const backendPath = queryString
            ? `/api/records/patient/mine?${queryString}`
            : "/api/records/patient/mine";

        const { data, status, setCookies } =
            await backendRequest<PageResponse<MedicalRecordSummary>>(
                backendPath,
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
            "Medical records could not be loaded",
        );
    }
}