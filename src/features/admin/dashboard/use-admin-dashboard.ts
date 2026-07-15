"use client";

import useSWR from "swr";

import {
    adminGetJson,
    type AdminApiError,
} from "@/features/admin/api-client";
import { useAdminAvailabilities } from "@/features/admin/availabilities/api";
import { useAdminDepartments } from "@/features/admin/departments/api";
import { useAdminDoctors } from "@/features/admin/doctors/api";
import type { AppointmentResponse } from "@/types/appointment";
import type { LabResponseSummary } from "@/types/lab";
import type { PageResponse } from "@/types/pagination";

const ADMIN_APPOINTMENTS_API =
    "/api/appointments";

const ADMIN_LAB_RESPONSES_API =
    "/api/lab-responses?page=0&size=100&sort=createdAt,desc";

export function useAdminDashboard() {
    const departmentsRequest =
        useAdminDepartments();

    const doctorsRequest =
        useAdminDoctors();

    const availabilitiesRequest =
        useAdminAvailabilities();

    const appointmentsRequest = useSWR<
        AppointmentResponse[],
        AdminApiError
    >(
        ADMIN_APPOINTMENTS_API,
        adminGetJson,
    );

    const labResponsesRequest = useSWR<
        PageResponse<LabResponseSummary>,
        AdminApiError
    >(
        ADMIN_LAB_RESPONSES_API,
        adminGetJson,
    );

    const departments =
        departmentsRequest.data ?? [];

    const doctors =
        doctorsRequest.data?.content ?? [];

    const availabilities =
        availabilitiesRequest.data ?? [];

    const appointments =
        appointmentsRequest.data ?? [];

    const labResponses =
        labResponsesRequest.data?.content ?? [];

    const isLoading =
        departmentsRequest.isLoading ||
        doctorsRequest.isLoading ||
        availabilitiesRequest.isLoading ||
        appointmentsRequest.isLoading ||
        labResponsesRequest.isLoading;

    const error =
        departmentsRequest.error ??
        doctorsRequest.error ??
        availabilitiesRequest.error ??
        appointmentsRequest.error ??
        labResponsesRequest.error;

    function retry() {
        void Promise.all([
            departmentsRequest.mutate(),
            doctorsRequest.mutate(),
            availabilitiesRequest.mutate(),
            appointmentsRequest.mutate(),
            labResponsesRequest.mutate(),
        ]);
    }

    return {
        departments,
        doctors,
        availabilities,
        appointments,
        labResponses,
        isLoading,
        error,
        retry,
    };
}