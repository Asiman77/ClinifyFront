"use client";

import useSWR from "swr";

import type { Department } from "@/types/department";

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
    });

    const responseText = await response.text();

    let payload: unknown;

    if (!responseText) {
        payload = undefined;
    } else {
        try {
            payload = JSON.parse(responseText);
        } catch {
            payload = responseText;
        }
    }

    if (!response.ok) {
        const message =
            typeof payload === "object" &&
                payload !== null &&
                "message" in payload &&
                typeof payload.message === "string"
                ? payload.message
                : "Request failed";

        throw new Error(message);
    }

    return payload as T;
}

export function useDepartments() {
    return useSWR<Department[]>("/api/departments", getJson);
}