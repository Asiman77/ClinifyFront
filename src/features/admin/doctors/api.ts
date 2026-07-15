"use client";

import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
    AdminApiError,
    adminGetJson,
    adminRequestJson,
} from "@/features/admin/api-client";
import type {
    CreateDoctorProfileRequest,
    DoctorProfile,
    UpdateDoctorProfileRequest,
} from "@/types/doctor";
import type { PageResponse } from "@/types/pagination";

const DOCTORS_API = "/api/doctors";

const ADMIN_DOCTORS_LIST_API =
    "/api/doctors?page=0&size=100&sort=id,asc";

type UpdateDoctorArg = {
    doctorId: number;
    request: UpdateDoctorProfileRequest;
};

function revalidateDoctors() {
    void mutate(ADMIN_DOCTORS_LIST_API);
}

async function createDoctor(
    url: string,
    { arg }: { arg: CreateDoctorProfileRequest },
) {
    return adminRequestJson<DoctorProfile>(url, {
        method: "POST",
        body: JSON.stringify(arg),
    });
}

async function updateDoctor(
    url: string,
    { arg }: { arg: UpdateDoctorArg },
) {
    return adminRequestJson<DoctorProfile>(
        `${url}/${arg.doctorId}`,
        {
            method: "PUT",
            body: JSON.stringify(arg.request),
        },
    );
}

export function useAdminDoctors() {
    return useSWR<
        PageResponse<DoctorProfile>,
        AdminApiError
    >(ADMIN_DOCTORS_LIST_API, adminGetJson);
}

export function useCreateDoctor() {
    return useSWRMutation<
        DoctorProfile,
        AdminApiError,
        string,
        CreateDoctorProfileRequest
    >(DOCTORS_API, createDoctor, {
        onSuccess: revalidateDoctors,
    });
}

export function useUpdateDoctor() {
    return useSWRMutation<
        DoctorProfile,
        AdminApiError,
        string,
        UpdateDoctorArg
    >(DOCTORS_API, updateDoctor, {
        onSuccess: revalidateDoctors,
    });
}