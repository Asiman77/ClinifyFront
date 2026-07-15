import { NextResponse } from "next/server";

import { departmentFormSchema } from "@/features/admin/departments/schemas";
import { backendFetch, backendRequest, } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { Department, DepartmentRequest, } from "@/types/department";

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

export async function POST(request: Request) {
    try {
        const values = departmentFormSchema.parse(
            await request.json(),
        );

        const payload: DepartmentRequest = {
            name: values.name,
            description: values.description || null,
            active: values.active,
        };

        const { data, status, setCookies } =
            await backendRequest<Department>("/api/departments",
                {
                    method: "POST",
                    headers: {
                        cookie:
                            request.headers.get("cookie") ??
                            "",
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
            "Department could not be created",
        );
    }
}