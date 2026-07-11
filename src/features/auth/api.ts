"use client";

import useSWRMutation from "swr/mutation";

import type {
  CheckFinResponse,
  CurrentUser,
  LoginResponse,
  LogoutResponse,
  SetupPasswordResponse,
  VerifyIdentityResponse,
} from "@/types/auth";
import {
  LoginRequest,
  SetupPasswordRequest,
  VerifyIdentityRequest,
} from "./schemas";

import useSWR from "swr";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);

    this.name = "AuthApiError";
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

  return "Request failed";
}

async function postJson<TResponse, TBody>(
  url: string,
  { arg }: { arg: TBody },
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new AuthApiError(getErrorMessage(payload), response.status, payload);
  }

  return payload as TResponse;
}

async function getJson<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new AuthApiError(getErrorMessage(payload), response.status, payload);
  }

  return payload as TResponse;
}

async function postWithoutBody<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new AuthApiError(getErrorMessage(payload), response.status, payload);
  }

  return payload as TResponse;
}

export function useCheckFin() {
  return useSWRMutation<
    CheckFinResponse,
    AuthApiError,
    string,
    { fin: string }
  >("/api/auth/check-fin", postJson);
}
export function useLogin() {
  return useSWRMutation<LoginResponse, AuthApiError, string, LoginRequest>(
    "/api/auth/login",
    postJson,
  );
}
export function useVerifyIdentity() {
  return useSWRMutation<
    VerifyIdentityResponse,
    AuthApiError,
    string,
    VerifyIdentityRequest
  >("/api/auth/register/verify", postJson);
}
export function useSetupPassword() {
  return useSWRMutation<
    SetupPasswordResponse,
    AuthApiError,
    string,
    SetupPasswordRequest
  >("/api/auth/register/setup-password", postJson);
}
export function useCurrentUser() {
  return useSWR<CurrentUser, AuthApiError>("/api/auth/me", getJson);
}
export function useLogout() {
  return useSWRMutation<LogoutResponse, AuthApiError, string>(
    "/api/auth/logout",
    postWithoutBody,
  );
}
