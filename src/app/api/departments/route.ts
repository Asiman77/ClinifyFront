import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { Department } from "@/types/department";

export async function GET() {
    try {
        const departments = await backendFetch<Department[]>(
            "/api/departments",
            {
                method: "GET",
                cache: "no-store",
            },
        );

        return NextResponse.json(departments);
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Departments could not be loaded",
        );
    }
}