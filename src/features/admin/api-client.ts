"use client";

export class AdminApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload?: unknown,
    ) {
        super(message);
        this.name = "AdminApiError";
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

    return "Admin request failed";
}

export async function adminRequestJson<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const headers = new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "same-origin",
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
        throw new AdminApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as T;
}

export function adminGetJson<T>(url: string): Promise<T> {
    return adminRequestJson<T>(url, {
        method: "GET",
    });
}