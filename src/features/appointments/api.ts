"use client";

import useSWRMutation from "swr/mutation";

import type { AppointmentResponse, PatientAppointmentRequest, } from "@/types/appointment";
import { PageResponse } from "@/types/pagination";
import useSWR from "swr";

export class AppointmentApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload?: unknown,
    ) {
        super(message);
        this.name = "AppointmentApiError";
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

    return "Appointment request failed";
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
        throw new AppointmentApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as TResponse;
}

async function postJson<TResponse, TRequest>(
    url: string,
    { arg }: { arg: TRequest },
): Promise<TResponse> {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
        throw new AppointmentApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as TResponse;
}

export function useCreateAppointment() {
    return useSWRMutation<
        AppointmentResponse,
        AppointmentApiError,
        string,
        PatientAppointmentRequest
    >("/api/appointments", postJson);
}
export type PatientAppointmentsQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

export function usePatientAppointments(
    query: PatientAppointmentsQuery = {},
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
        ? `/api/appointments/mine?${queryString}`
        : "/api/appointments/mine";

    return useSWR<
        PageResponse<AppointmentResponse>,
        AppointmentApiError
    >(url, getJson);
}
export type CancelAppointmentRequest = {
    appointmentId: number;
};
async function patchCancelAppointment(
    baseUrl: string,
    {
        arg,
    }: {
        arg: CancelAppointmentRequest;
    },
): Promise<AppointmentResponse> {
    const response = await fetch(
        `${baseUrl}/${arg.appointmentId}/cancel`,
        {
            method: "PATCH",
            credentials: "same-origin",
        },
    );

    const payload = await parseResponse(response);

    if (!response.ok) {
        throw new AppointmentApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as AppointmentResponse;
}

export function useCancelAppointment() {
    return useSWRMutation<
        AppointmentResponse,
        AppointmentApiError,
        string,
        CancelAppointmentRequest
    >("/api/appointments", patchCancelAppointment);
}