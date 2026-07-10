export class BackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);

    this.name = "BackendError";
  }
}

export type BackendResult<T> = {
  data: T;
  status: number;
  setCookies: string[];
};

function getBackendUrl(): string {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_URL is not configured");
  }

  return backendUrl.replace(/\/+$/, "");
}

async function parseResponseBody(response: Response): Promise<unknown> {
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

function getErrorMessage(payload: unknown, status: number): string {
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

  return `Backend request failed with status ${status}`;
}

function getSetCookies(headers: Headers): string[] {
  const headersWithCookies = headers as Headers & {
    getSetCookie?: () => string[];
  };

  const cookies = headersWithCookies.getSetCookie?.();

  if (cookies?.length) {
    return cookies;
  }

  const cookie = headers.get("set-cookie");

  return cookie ? [cookie] : [];
}

export async function backendRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<BackendResult<T>> {
  if (!path.startsWith("/")) {
    throw new Error("Backend path must start with '/'");
  }

  const headers = new Headers(options.headers);

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...options,
    headers,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new BackendError(
      getErrorMessage(payload, response.status),
      response.status,
      payload,
    );
  }

  return {
    data: payload as T,
    status: response.status,
    setCookies: getSetCookies(response.headers),
  };
}

export async function backendFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const result = await backendRequest<T>(path, options);

  return result.data;
}
