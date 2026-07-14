"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import type {
    LabResponse,
    LabResponseDetail,
    LabResponseSummary,
    LabStatus,
    UpdateLabResponseRequest,
} from "@/types/lab";
import type { PageResponse } from "@/types/pagination";

export class LabApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload?: unknown,
    ) {
        super(message);
        this.name = "LabApiError";
    }
}

async function parsePayload(
    response: Response,
): Promise<unknown> {
    const text = await response.text();
    if (!text) {
        return undefined;
    }
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(payload: unknown): string {
    if (
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof payload.message === "string"
    ) {
        return payload.message;
    }

    if (typeof payload === "string" && payload.trim()) {
        return payload;
    }

    return "Lab request failed";
}

export async function labRequest<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        credentials: "same-origin",
        cache: "no-store",
    });

    const payload = await parsePayload(response);

    if (!response.ok) {
        throw new LabApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as T;
}

export type LabResponsesQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

function createListUrl(
    baseUrl: string,
    query: LabResponsesQuery,
): string {
    const searchParams = new URLSearchParams();

    if (query.page !== undefined) {
        searchParams.set("page", String(query.page));
    }

    if (query.size !== undefined) {
        searchParams.set("size", String(query.size));
    }

    if (query.sort?.trim()) {
        searchParams.set("sort", query.sort.trim());
    }

    const queryString = searchParams.toString();

    return queryString
        ? `${baseUrl}?${queryString}`
        : baseUrl;
}

export function useLabResponses(
    query: LabResponsesQuery = {},
) {
    const url = createListUrl(
        "/api/lab-responses",
        query,
    );

    return useSWR<
        PageResponse<LabResponseSummary>,
        LabApiError
    >(url, labRequest);
}

export function useOpenLabResponses(
    query: LabResponsesQuery = {},
) {
    const url = createListUrl(
        "/api/lab-responses/pending",
        query,
    );

    return useSWR<
        PageResponse<LabResponseSummary>,
        LabApiError
    >(url, labRequest);
}

export function useLabResponse(
    responseId: number | null,
) {
    const url = responseId === null ? null : `/api/lab-responses/${responseId}`;

    return useSWR<LabResponseDetail, LabApiError>(url, labRequest);
}
export type UpdateLabResponseArgs = {
    responseId: number;
    data: UpdateLabResponseRequest;
};

async function updateLabResponse(
    baseUrl: string,
    { arg }: { arg: UpdateLabResponseArgs },
) {
    return labRequest<LabResponse>(
        `${baseUrl}/${arg.responseId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(arg.data),
        },
    );
}

export function useUpdateLabResponse() {
    return useSWRMutation<
        LabResponse,
        LabApiError,
        string,
        UpdateLabResponseArgs
    >("/api/lab-responses", updateLabResponse);
}

export type UpdateLabStatusArgs = {
    responseId: number;
    status: LabStatus;
};

async function updateLabStatus(
    baseUrl: string,
    { arg }: { arg: UpdateLabStatusArgs },
) {
    return labRequest<LabResponse>(
        `${baseUrl}/${arg.responseId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: arg.status,
            }),
        },
    );
}

export function useUpdateLabStatus() {
    return useSWRMutation<
        LabResponse,
        LabApiError,
        string,
        UpdateLabStatusArgs
    >("/api/lab-responses", updateLabStatus);
}

export type UploadLabFileArgs = {
    responseId: number;
    file: File;
};

async function uploadLabFile(
    baseUrl: string,
    { arg }: { arg: UploadLabFileArgs },
) {
    const formData = new FormData();
    formData.set("file", arg.file);

    return labRequest<LabResponse>(
        `${baseUrl}/${arg.responseId}/files`,
        {
            method: "POST",
            body: formData,
        },
    );
}

export function useUploadLabFile() {
    return useSWRMutation<
        LabResponse,
        LabApiError,
        string,
        UploadLabFileArgs
    >("/api/lab-responses", uploadLabFile);
}

export type DeleteLabFileArgs = {
    responseId: number;
    publicId: string;
};

async function deleteLabFile(
    baseUrl: string,
    { arg }: { arg: DeleteLabFileArgs },
) {
    return labRequest<LabResponse>(
        `${baseUrl}/${arg.responseId}/files`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicId: arg.publicId,
            }),
        },
    );
}

export function useDeleteLabFile() {
    return useSWRMutation<
        LabResponse,
        LabApiError,
        string,
        DeleteLabFileArgs
    >("/api/lab-responses", deleteLabFile);
}