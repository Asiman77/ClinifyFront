"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import {
    DoctorApiError,
    doctorGetJson,
    doctorRequestJson,
} from "@/features/doctor/api-client";
import type { AppointmentResponse } from "@/types/appointment";
import type { PageResponse } from "@/types/pagination";

export type DoctorAppointmentsQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

export type DoctorAppointmentsData = {
    page: PageResponse<AppointmentResponse>;
    currentDateTime: string;
};

export type DoctorAppointmentAction =
    | "approve"
    | "reject"
    | "complete";

type ActionRequest = {
    appointmentId: number;
    action: DoctorAppointmentAction;
};

async function getAppointments(
    url: string,
): Promise<DoctorAppointmentsData> {
    const page = await doctorGetJson<
        PageResponse<AppointmentResponse>
    >(url);

    return {
        page,
        currentDateTime: new Date().toISOString(),
    };
}

export function useDoctorAppointments(
    query: DoctorAppointmentsQuery = {},
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
        ? `/api/doctor/appointments?${queryString}`
        : "/api/doctor/appointments";

    return useSWR<DoctorAppointmentsData, DoctorApiError>(
        url,
        getAppointments,
    );
}

async function patchAppointment(
    baseUrl: string,
    { arg }: { arg: ActionRequest },
) {
    return doctorRequestJson<AppointmentResponse>(
        `${baseUrl}/${arg.appointmentId}/${arg.action}`,
        { method: "PATCH" },
    );
}

export function useDoctorAppointmentAction() {
    return useSWRMutation<
        AppointmentResponse,
        DoctorApiError,
        string,
        ActionRequest
    >("/api/doctor/appointments", patchAppointment);
}
