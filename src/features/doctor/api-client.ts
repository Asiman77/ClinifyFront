export class DoctorApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly payload?: unknown,
    ) {
        super(message);
        this.name = "DoctorApiError";
    }
}

async function parseResponse(response: Response): Promise<unknown> {
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

    return "Doctor request failed";
}

export async function doctorRequestJson<TResponse>(
    url: string,
    options: RequestInit = {},
): Promise<TResponse> {
    const response = await fetch(url, {
        ...options,
        credentials: "same-origin",
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
        },
        cache: "no-store",
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
        throw new DoctorApiError(
            getErrorMessage(payload),
            response.status,
            payload,
        );
    }

    return payload as TResponse;
}

export function doctorGetJson<TResponse>(url: string) {
    return doctorRequestJson<TResponse>(url, { method: "GET" });
}
