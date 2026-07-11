import { NextResponse } from "next/server";
import { z } from "zod";

import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { DoctorProfile } from "@/types/doctor";

const doctorIdSchema = z.coerce
    .number()
    .int("Doctor id must be an integer")
    .positive("Doctor id must be positive");

type DoctorRouteContext = {
    params: Promise<{
        doctorId: string;
    }>;
};

export async function GET(
    _request: Request,
    { params }: DoctorRouteContext,
) {
    try {
        const routeParams = await params;
        const doctorId = doctorIdSchema.parse(routeParams.doctorId);

        const doctor = await backendFetch<DoctorProfile>(
            `/api/doctors/${doctorId}`,
            {
                method: "GET",
                cache: "no-store",
            },
        );

        return NextResponse.json(doctor);
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Doctor could not be loaded",
        );
    }
}