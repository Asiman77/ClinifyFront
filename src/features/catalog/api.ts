"use client";

import useSWR from "swr";

import type { Department } from "@/types/department";
import type { PageResponse } from "@/types/pagination";
import type { DoctorProfile } from "@/types/doctor";
import { AppointmentType, AvailableSlot } from "@/types/slot";

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
export type DoctorsQuery = {
    departmentId?: number;
    specialization?: string;
    experienceYears?: number;
    page?: number;
    size?: number;
    sort?: string;
};

export function useDoctors(query: DoctorsQuery = {}) {
    const searchParams = new URLSearchParams();

    if (query.departmentId !== undefined) {
        searchParams.set("departmentId", String(query.departmentId));
    }

    if (query.specialization?.trim()) {
        searchParams.set("specialization", query.specialization.trim());
    }

    if (query.experienceYears !== undefined) {
        searchParams.set("experienceYears", String(query.experienceYears));
    }

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
        ? `/api/doctors?${queryString}`
        : "/api/doctors";

    return useSWR<PageResponse<DoctorProfile>>(url, getJson);
}
export function useDoctor(
    doctorId: number | null | undefined,
) {
    const url =
        doctorId !== null &&
            doctorId !== undefined &&
            doctorId > 0
            ? `/api/doctors/${doctorId}`
            : null;

    return useSWR<DoctorProfile>(url, getJson);
}
export type AvailableSlotsQuery = {
    doctorId?: number | null;
    date?: string;
    type?: AppointmentType;
    page?: number;
    size?: number;
    sort?: string;
};

export function useAvailableSlots(
    query: AvailableSlotsQuery,
) {
    const hasRequiredParameters =
        query.doctorId !== null &&
        query.doctorId !== undefined &&
        query.doctorId > 0 &&
        Boolean(query.date) &&
        Boolean(query.type);

    let url: string | null = null;

    if (hasRequiredParameters) {
        const searchParams = new URLSearchParams();

        searchParams.set("date", query.date!);
        searchParams.set("type", query.type!);

        if (query.page !== undefined) {
            searchParams.set("page", String(query.page));
        }

        if (query.size !== undefined) {
            searchParams.set("size", String(query.size));
        }

        if (query.sort?.trim()) {
            searchParams.set("sort", query.sort.trim());
        }

        url =
            `/api/doctors/${query.doctorId}/available-slots` +
            `?${searchParams.toString()}`;
    }

    return useSWR<PageResponse<AvailableSlot>>(url, getJson);
}