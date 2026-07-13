import { NextResponse } from "next/server";
import { z } from "zod";

import { createMedicalRecordRequestSchema } from "@/features/doctor/records/schemas";
import type { MedicalRecord } from "@/features/doctor/records/types";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
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
            ? `/api/records/doctor/mine?${queryString}`
            : "/api/records/doctor/mine";

        return proxyRecordRequest<PageResponse<MedicalRecord>>(
            request,
            backendPath,
            { method: "GET" },
        );
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Medical records could not be loaded",
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = createMedicalRecordRequestSchema.parse(
            await request.json(),
        );

        return proxyRecordRequest<MedicalRecord>(
            request,
            "/api/records",
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Medical record could not be created",
        );
    }
}

async function proxyRecordRequest<T>(
    request: Request,
    backendPath: string,
    options: RequestInit,
) {
    const { data, status, setCookies } = await backendRequest<T>(
        backendPath,
        {
            ...options,
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
}
