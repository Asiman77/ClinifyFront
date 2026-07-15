import { NextResponse } from "next/server";
import { z } from "zod";

import { availabilityFormSchema } from "@/features/admin/availabilities/schemas";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type {
    DoctorAvailability,
    UpdateDoctorAvailabilityRequest,
} from "@/types/availability";

const availabilityIdSchema = z.coerce
    .number()
    .int("Availability id must be an integer")
    .positive("Availability id must be positive");

const updateAvailabilitySchema =
    availabilityFormSchema.omit({
        doctorId: true,
    });

const statusSchema = z.object({
    active: z.boolean(),
});

type AvailabilityRouteContext = {
    params: Promise<{
        availabilityId: string;
    }>;
};

export async function PUT(
    request: Request,
    { params }: AvailabilityRouteContext,
) {
    try {
        const routeParams = await params;
        const availabilityId =
            availabilityIdSchema.parse(
                routeParams.availabilityId,
            );

        const values = updateAvailabilitySchema.parse(
            await request.json(),
        );

        const payload: UpdateDoctorAvailabilityRequest = {
            dayOfWeek: values.dayOfWeek,
            startTime: values.startTime,
            endTime: values.endTime,
            slotDurationMinutes:
                values.slotDurationMinutes,
            availabilityType:
                values.availabilityType,
            active: values.active,
        };

        const { data, status, setCookies } =
            await backendRequest<DoctorAvailability>(
                `/api/availabilities/${availabilityId}`,
                {
                    method: "PUT",
                    headers: {
                        cookie:
                            request.headers.get("cookie") ?? "",
                    },
                    body: JSON.stringify(payload),
                    cache: "no-store",
                },
            );

        const response = NextResponse.json(data, {
            status,
        });

        appendSetCookies(response, setCookies);

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Availability could not be updated",
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: AvailabilityRouteContext,
) {
    try {
        const routeParams = await params;
        const availabilityId =
            availabilityIdSchema.parse(
                routeParams.availabilityId,
            );

        const { active } = statusSchema.parse(
            await request.json(),
        );

        const { data, status, setCookies } =
            await backendRequest<DoctorAvailability>(
                `/api/availabilities/${availabilityId}/status?active=${active}`,
                {
                    method: "PATCH",
                    headers: {
                        cookie:
                            request.headers.get("cookie") ?? "",
                    },
                    cache: "no-store",
                },
            );

        const response = NextResponse.json(data, {
            status,
        });

        appendSetCookies(response, setCookies);

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Availability status could not be updated",
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: AvailabilityRouteContext,
) {
    try {
        const routeParams = await params;
        const availabilityId =
            availabilityIdSchema.parse(
                routeParams.availabilityId,
            );

        const { status, setCookies } =
            await backendRequest<void>(
                `/api/availabilities/${availabilityId}`,
                {
                    method: "DELETE",
                    headers: {
                        cookie:
                            request.headers.get("cookie") ?? "",
                    },
                    cache: "no-store",
                },
            );

        const response = new NextResponse(null, {
            status,
        });

        appendSetCookies(response, setCookies);

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Availability could not be deleted",
        );
    }
}

function appendSetCookies(
    response: NextResponse,
    setCookies: string[],
) {
    for (const cookie of setCookies) {
        response.headers.append("Set-Cookie", cookie);
    }
}