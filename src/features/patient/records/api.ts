"use client";

import useSWR from "swr";

import type {
    MedicalRecord,
    MedicalRecordSummary,
} from "@/types/medical-record";
import type { PageResponse } from "@/types/pagination";

export class PatientRecordApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload?: unknown,
    ) {
        super(message);
        this.name = "PatientRecordApiError";
    }
}

async function parseResponse(
    response: Response,
): Promise<unknown> {
    const responseText = await response.text();

    if (!responseText) {
        return undefined;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
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

    return "Patient medical record request failed";
}

async function getJson<TResponse>(
    url: string,
): Promise<TResponse> {
    const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
        throw new PatientRecordApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as TResponse;
}

export type PatientRecordsQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

export function usePatientMedicalRecords(
    query: PatientRecordsQuery = {},
) {
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

    const url = queryString
        ? `/api/patient/records?${queryString}`
        : "/api/patient/records";

    return useSWR<
        PageResponse<MedicalRecordSummary>,
        PatientRecordApiError
    >(url, getJson);
}

export function usePatientMedicalRecord(
    recordId?: number,
) {
    const url =
        recordId !== undefined && recordId > 0
            ? `/api/patient/records/${recordId}`
            : null;

    return useSWR<MedicalRecord, PatientRecordApiError>(
        url,
        getJson,
    );
}