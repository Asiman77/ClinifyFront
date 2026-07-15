import { NextResponse } from "next/server";

import { backendFetch, backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { PageResponse } from "@/types/pagination";
import { CreateDoctorProfileRequest, DoctorProfile } from "@/types/doctor";
import { doctorFormSchema } from "@/features/admin/doctors/schemas";

const ALLOWED_QUERY_PARAMS = [
    "departmentId",
    "specialization",
    "experienceYears",
    "page",
    "size",
    "sort",
] as const;

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);
        const backendSearchParams = new URLSearchParams();

        for (const parameter of ALLOWED_QUERY_PARAMS) {
            const values = requestUrl.searchParams.getAll(parameter);

            for (const value of values) {
                if (value.trim()) {
                    backendSearchParams.append(parameter, value);
                }
            }
        }

        const query = backendSearchParams.toString();

        const backendPath = query
            ? `/api/doctors?${query}`
            : "/api/doctors";

        const doctors = await backendFetch<PageResponse<DoctorProfile>>(
            backendPath,
            {
                method: "GET",
                cache: "no-store",
            },
        );

        return NextResponse.json(doctors);
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Doctors could not be loaded",
        );
    }
}
export async function POST(request: Request) {
    try {
        const values = doctorFormSchema.parse(
            await request.json(),
        );

        const payload: CreateDoctorProfileRequest = {
            userId: values.userId,
            departmentId: values.departmentId,
            specialization: values.specialization,
            bio: values.bio || null,
            experienceYears: values.experienceYears,
            active: values.active,
        };

        const { data, status, setCookies } =
            await backendRequest<DoctorProfile>(
                "/api/doctors",
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
            "Doctor could not be created",
        );
    }
}