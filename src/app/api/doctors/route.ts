import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { PageResponse } from "@/types/pagination";
import { DoctorProfile } from "@/types/doctor";

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