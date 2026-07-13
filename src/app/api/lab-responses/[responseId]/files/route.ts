import { NextResponse } from "next/server";
import { z } from "zod";

import { backendRequest } from "@/lib/api/backend";
import { createRouteErrorResponse } from "@/lib/api/route-error";
import type { LabResponse } from "@/types/lab";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
]);

const responseIdSchema = z.coerce
    .number()
    .int("Lab response id must be an integer")
    .positive("Lab response id must be positive");

const deleteFileSchema = z.object({
    publicId: z.string().trim().min(
        1,
        "Public id is required",
    ),
});

type FilesRouteContext = {
    params: Promise<{
        responseId: string;
    }>;
};

function createResponse(
    data: LabResponse,
    status: number,
    setCookies: string[],
) {
    const response = NextResponse.json(data, { status });

    for (const cookie of setCookies) {
        response.headers.append("Set-Cookie", cookie);
    }

    return response;
}

export async function POST(
    request: Request,
    { params }: FilesRouteContext,
) {
    try {
        const routeParams = await params;
        const responseId = responseIdSchema.parse(
            routeParams.responseId,
        );

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json(
                { message: "File is required" },
                { status: 400 },
            );
        }

        if (!ALLOWED_FILE_TYPES.has(file.type)) {
            return NextResponse.json(
                {
                    message:
                        "Only PDF, PNG and JPG files are allowed",
                },
                { status: 400 },
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    message:
                        "File size must not exceed 10MB",
                },
                { status: 400 },
            );
        }

        const backendFormData = new FormData();
        backendFormData.set("file", file, file.name);

        const result = await backendRequest<LabResponse>(
            `/api/lab-responses/${responseId}/files`,
            {
                method: "POST",
                headers: {
                    cookie:
                        request.headers.get("cookie") ?? "",
                },
                body: backendFormData,
                cache: "no-store",
            },
        );

        return createResponse(
            result.data,
            result.status,
            result.setCookies,
        );
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Lab response file could not be uploaded",
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: FilesRouteContext,
) {
    try {
        const routeParams = await params;
        const responseId = responseIdSchema.parse(
            routeParams.responseId,
        );

        const requestBody = await request.json();
        const validatedBody =
            deleteFileSchema.parse(requestBody);

        const result = await backendRequest<LabResponse>(
            `/api/lab-responses/${responseId}/files`,
            {
                method: "DELETE",
                headers: {
                    cookie:
                        request.headers.get("cookie") ?? "",
                },
                body: JSON.stringify(validatedBody),
                cache: "no-store",
            },
        );

        return createResponse(
            result.data,
            result.status,
            result.setCookies,
        );
    } catch (error) {
        return createRouteErrorResponse(
            error,
            "Lab response file could not be deleted",
        );
    }
}