import { NextResponse } from "next/server";

import { patientAppointmentRequestSchema } from "@/features/appointments/schemas";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { AppointmentResponse } from "@/types/appointment";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const validatedBody = patientAppointmentRequestSchema.parse(requestBody);
        const { data, status, setCookies } =
            await backendRequest<AppointmentResponse>(
                "/api/appointments",
                {
                    method: "POST",
                    headers: {
                        cookie: request.headers.get("cookie") ?? "",
                    },
                    body: JSON.stringify(validatedBody),
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
            "Appointment could not be created",
        );
    }
}