"use client";

import { useAdminAvailabilities } from "@/features/admin/availabilities/api";
import { useAdminDepartments } from "@/features/admin/departments/api";
import { useAdminDoctors } from "@/features/admin/doctors/api";

export function useAdminDashboard() {
    const departmentsRequest = useAdminDepartments();
    const doctorsRequest = useAdminDoctors();
    const availabilitiesRequest = useAdminAvailabilities();

    const departments =
        departmentsRequest.data ?? [];

    const doctors =
        doctorsRequest.data?.content ?? [];

    const availabilities =
        availabilitiesRequest.data ?? [];

    const isLoading =
        departmentsRequest.isLoading ||
        doctorsRequest.isLoading ||
        availabilitiesRequest.isLoading;

    const error =
        departmentsRequest.error ??
        doctorsRequest.error ??
        availabilitiesRequest.error;

    function retry() {
        void Promise.all([
            departmentsRequest.mutate(),
            doctorsRequest.mutate(),
            availabilitiesRequest.mutate(),
        ]);
    }

    return {
        departments,
        doctors,
        availabilities,
        isLoading,
        error,
        retry,
    };
}