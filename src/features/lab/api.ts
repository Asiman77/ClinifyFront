"use client";

import useSWR from "swr";

import type {
    LabResponseDetail,
    LabResponseSummary,
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