import { NextResponse } from "next/server";
import { z } from "zod";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { AppointmentResponse } from "@/types/appointment";

const appointmentIdSchema = z.coerce
    .number()
    .int("Appointment id must be an integer")
    .positive("Appointment id must be positive");

const actionSchema = z.enum([
    "approve",
    "reject",
    "complete",
]);

type DoctorAppointmentActionRouteContext = {
    params: Promise<{
        appointmentId: string;
        action: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: DoctorAppointmentActionRouteContext,
) {
    try {
        const routeParams = await params;

        const appointmentId = appointmentIdSchema.parse(
            routeParams.appointmentId,
        );
        const action = actionSchema.parse(routeParams.action);

        const { data, status, setCookies } =
            await backendRequest<AppointmentResponse>(
                `/api/appointments/${appointmentId}/${action}`,
                {
                    method: "PATCH",
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
            "Appointment status could not be updated",
        );
    }
}