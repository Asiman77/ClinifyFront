import { NextResponse } from "next/server";
import { z } from "zod";

import { backendFetch, backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { DoctorProfile, UpdateDoctorProfileRequest } from "@/types/doctor";
import { doctorFormSchema } from "@/features/admin/doctors/schemas";

const doctorIdSchema = z.coerce
    .number()
    .int("Doctor id must be an integer")
    .positive("Doctor id must be positive");

type DoctorRouteContext = {
    params: Promise<{
        doctorId: string;
    }>;
};
const updateDoctorSchema = doctorFormSchema.omit({
    userId: true,
});
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
export async function PUT(
    request: Request,
    { params }: DoctorRouteContext,
) {
    try {
        const routeParams = await params;
        const doctorId = doctorIdSchema.parse(
            routeParams.doctorId,
        );

        const values = updateDoctorSchema.parse(
            await request.json(),
        );

        const payload: UpdateDoctorProfileRequest = {
            departmentId: values.departmentId,
            specialization: values.specialization,
            bio: values.bio || null,
            experienceYears: values.experienceYears,
            active: values.active,
        };

        const { data, status, setCookies } =
            await backendRequest<DoctorProfile>(
                `/api/doctors/${doctorId}`,
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

        for (const cookie of setCookies) {
            response.headers.append("Set-Cookie", cookie);
        }

        return response;
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Doctor could not be updated",
        );
    }
}