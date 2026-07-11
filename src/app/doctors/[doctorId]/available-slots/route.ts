import { NextResponse } from "next/server";
import { z } from "zod";

import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import {
    APPOINTMENT_TYPES,
    type AvailableSlot,
} from "@/types/slot";
import type { PageResponse } from "@/types/pagination";

const doctorIdSchema = z.coerce
    .number()
    .int("Doctor id must be an integer")
    .positive("Doctor id must be positive");

const availableSlotsQuerySchema = z.object({
    date: z.iso.date("Date must use YYYY-MM-DD format"),
    type: z.enum(APPOINTMENT_TYPES),
    page: z.coerce.number().int().min(0).optional(),
    size: z.coerce.number().int().min(1).max(100).optional(),
    sort: z.string().trim().min(1).optional(),
});

type AvailableSlotsRouteContext = {
    params: Promise<{
        doctorId: string;
    }>;
};

export async function GET(
    request: Request,
    { params }: AvailableSlotsRouteContext,
) {
    try {
        const routeParams = await params;
        const doctorId = doctorIdSchema.parse(routeParams.doctorId);

        const requestUrl = new URL(request.url);

        const query = availableSlotsQuerySchema.parse(
            Object.fromEntries(requestUrl.searchParams),
        );

        const backendSearchParams = new URLSearchParams({
            date: query.date,
            type: query.type,
        });

        if (query.page !== undefined) {
            backendSearchParams.set("page", String(query.page));
        }

        if (query.size !== undefined) {
            backendSearchParams.set("size", String(query.size));
        }

        if (query.sort) {
            backendSearchParams.set("sort", query.sort);
        }

        const slots = await backendFetch<
            PageResponse<AvailableSlot>
        >(
            `/api/doctors/${doctorId}/available-slots?${backendSearchParams.toString()}`,
            {
                method: "GET",
                cache: "no-store",
            },
        );

        return NextResponse.json(slots);
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Available slots could not be loaded",
        );
    }
}