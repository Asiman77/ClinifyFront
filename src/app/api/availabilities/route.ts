import { NextResponse } from "next/server";

import { availabilityFormSchema } from "@/features/admin/availabilities/schemas";
import {
    backendFetch,
    backendRequest,
} from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type {
    CreateDoctorAvailabilityRequest,
    DoctorAvailability,
} from "@/types/availability";

export async function GET() {
    try {
        const availabilities =
            await backendFetch<DoctorAvailability[]>(
                "/api/availabilities",
                {
                    method: "GET",
                    cache: "no-store",
                },
            );

        return NextResponse.json(availabilities);
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Availabilities could not be loaded",
        );
    }
}

export async function POST(request: Request) {
    try {
        const values = availabilityFormSchema.parse(
            await request.json(),
        );

        const payload: CreateDoctorAvailabilityRequest = {
            doctorId: values.doctorId,
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
                "/api/availabilities",
                {
                    method: "POST",
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

        for (const cookie of setCookies) {
            response.headers.append("Set-Cookie", cookie);
        }

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Availability could not be created",
        );
    }
}