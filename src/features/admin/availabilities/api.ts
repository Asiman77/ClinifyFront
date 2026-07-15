"use client";

import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
    AdminApiError,
    adminGetJson,
    adminRequestJson,
} from "@/features/admin/api-client";
import type {
    CreateDoctorAvailabilityRequest,
    DoctorAvailability,
    UpdateDoctorAvailabilityRequest,
} from "@/types/availability";

const AVAILABILITIES_API = "/api/availabilities";

type UpdateAvailabilityArg = {
    availabilityId: number;
    request: UpdateDoctorAvailabilityRequest;
};

type UpdateAvailabilityStatusArg = {
    availabilityId: number;
    active: boolean;
};

type DeleteAvailabilityArg = {
    availabilityId: number;
};

function revalidateAvailabilities() {
    void mutate(AVAILABILITIES_API);
}

async function createAvailability(
    url: string,
    {
        arg,
    }: {
        arg: CreateDoctorAvailabilityRequest;
    },
) {
    return adminRequestJson<DoctorAvailability>(url, {
        method: "POST",
        body: JSON.stringify(arg),
    });
}

async function updateAvailability(
    url: string,
    {
        arg,
    }: {
        arg: UpdateAvailabilityArg;
    },
) {
    return adminRequestJson<DoctorAvailability>(
        `${url}/${arg.availabilityId}`,
        {
            method: "PUT",
            body: JSON.stringify(arg.request),
        },
    );
}

async function updateAvailabilityStatus(
    url: string,
    {
        arg,
    }: {
        arg: UpdateAvailabilityStatusArg;
    },
) {
    return adminRequestJson<DoctorAvailability>(
        `${url}/${arg.availabilityId}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                active: arg.active,
            }),
        },
    );
}

async function deleteAvailability(
    url: string,
    {
        arg,
    }: {
        arg: DeleteAvailabilityArg;
    },
) {
    return adminRequestJson<void>(
        `${url}/${arg.availabilityId}`,
        {
            method: "DELETE",
        },
    );
}

export function useAdminAvailabilities() {
    return useSWR<
        DoctorAvailability[],
        AdminApiError
    >(AVAILABILITIES_API, adminGetJson);
}

export function useCreateAvailability() {
    return useSWRMutation<
        DoctorAvailability,
        AdminApiError,
        string,
        CreateDoctorAvailabilityRequest
    >(AVAILABILITIES_API, createAvailability, {
        onSuccess: revalidateAvailabilities,
    });
}

export function useUpdateAvailability() {
    return useSWRMutation<
        DoctorAvailability,
        AdminApiError,
        string,
        UpdateAvailabilityArg
    >(AVAILABILITIES_API, updateAvailability, {
        onSuccess: revalidateAvailabilities,
    });
}

export function useUpdateAvailabilityStatus() {
    return useSWRMutation<
        DoctorAvailability,
        AdminApiError,
        string,
        UpdateAvailabilityStatusArg
    >(AVAILABILITIES_API, updateAvailabilityStatus, {
        onSuccess: revalidateAvailabilities,
    });
}

export function useDeleteAvailability() {
    return useSWRMutation<
        void,
        AdminApiError,
        string,
        DeleteAvailabilityArg
    >(AVAILABILITIES_API, deleteAvailability, {
        onSuccess: revalidateAvailabilities,
    });
}