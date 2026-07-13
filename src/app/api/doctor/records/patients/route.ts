import { NextResponse } from "next/server";

import type { DoctorPatient } from "@/features/doctor/records/types";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";

export async function GET(request: Request) {
    try {
        const { data, status, setCookies } =
            await backendRequest<DoctorPatient[]>(
                "/api/records/doctor/patients",
                {
                    method: "GET",
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
            "Doctor patients could not be loaded",
        );
    }
}
