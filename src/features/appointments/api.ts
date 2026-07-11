"use client";

import useSWRMutation from "swr/mutation";

import type { AppointmentResponse, PatientAppointmentRequest, } from "@/types/appointment";

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