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

export async function backendRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T; setCookie: string | null }> {
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
    throw new Error(
      `Backend request failed with status ${response.status}`,
    );
  }

  return {
    data: payload as T,
    setCookie: response.headers.get("set-cookie"),
  };
}

export async function backendFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const result = await backendRequest<T>(path, options);

  return result.data;
}