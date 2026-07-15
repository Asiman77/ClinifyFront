import { NextResponse } from "next/server";
import { z } from "zod";

import { departmentFormSchema } from "@/features/admin/departments/schemas";
import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { Department, DepartmentRequest, } from "@/types/department";

const paramsSchema = z.object({
    departmentId: z.coerce.number().int().positive(),
});

type DepartmentRouteContext = {
    params: Promise<{
        departmentId: string;
    }>;
};

export async function PUT(
    request: Request,
    context: DepartmentRouteContext,
) {
    try {
        const { departmentId } = paramsSchema.parse(
            await context.params,
        );

        const values = departmentFormSchema.parse(
            await request.json(),
        );

        const payload: DepartmentRequest = {
            name: values.name,
            description: values.description || null,
            active: values.active,
        };

        const { data, status, setCookies } =
            await backendRequest<Department>(
                `/api/departments/${departmentId}`,
                {
                    method: "PUT",
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
            "Department could not be updated",
        );
    }
}
