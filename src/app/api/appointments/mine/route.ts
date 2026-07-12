import { NextResponse } from "next/server";
import { z } from "zod";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { AppointmentResponse } from "@/types/appointment";
import type { PageResponse } from "@/types/pagination";

const appointmentsQuerySchema = z.object({
    page: z.coerce.number().int().min(0).optional(),
    size: z.coerce.number().int().min(1).max(100).optional(),
    sort: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);

        const query = appointmentsQuerySchema.parse(
            Object.fromEntries(requestUrl.searchParams),
        );

        const backendSearchParams = new URLSearchParams();

        if (query.page !== undefined) {
            backendSearchParams.set("page", String(query.page));
        }

        if (query.size !== undefined) {
            backendSearchParams.set("size", String(query.size));
        }

        if (query.sort) {
            backendSearchParams.set("sort", query.sort);
        }

        const queryString = backendSearchParams.toString();

        const backendPath = queryString
            ? `/api/appointments/mine?${queryString}`
            : "/api/appointments/mine";

        const { data, status, setCookies } =
            await backendRequest<
                PageResponse<AppointmentResponse>
            >(backendPath, {
                method: "GET",
                headers: {
                    cookie: request.headers.get("cookie") ?? "",
                },
                cache: "no-store",
            });

        const response = NextResponse.json(data, {
            status,
        });

        for (const cookie of setCookies) {
            response.headers.append("Set-Cookie", cookie);
        }

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Appointments could not be loaded",
        );
    }
}