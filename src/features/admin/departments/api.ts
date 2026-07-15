"use client";

import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
    AdminApiError,
    adminGetJson,
    adminRequestJson,
} from "@/features/admin/api-client";
import type {
    Department,
    DepartmentRequest,
} from "@/types/department";

const DEPARTMENTS_API = "/api/departments";

type UpdateDepartmentArg = {
    departmentId: number;
    request: DepartmentRequest;
};

type DeactivateDepartmentArg = {
    departmentId: number;
};

function revalidateDepartments() {
    void mutate(DEPARTMENTS_API);
}

async function createDepartment(
    url: string,
    { arg }: { arg: DepartmentRequest },
) {
    return adminRequestJson<Department>(url, {
        method: "POST",
        body: JSON.stringify(arg),
    });
}

async function updateDepartment(
    url: string,
    { arg }: { arg: UpdateDepartmentArg },
) {
    return adminRequestJson<Department>(
        `${url}/${arg.departmentId}`,
        {
            method: "PUT",
            body: JSON.stringify(arg.request),
        },
    );
}

async function deactivateDepartment(
    url: string,
    { arg }: { arg: DeactivateDepartmentArg },
) {
    return adminRequestJson<void>(
        `${url}/${arg.departmentId}`,
        {
            method: "DELETE",
        },
    );
}

export function useAdminDepartments() {
    return useSWR<Department[], AdminApiError>(
        DEPARTMENTS_API,
        adminGetJson,
    );
}

export function useCreateDepartment() {
    return useSWRMutation<
        Department,
        AdminApiError,
        string,
        DepartmentRequest
    >(DEPARTMENTS_API, createDepartment, {
        onSuccess: revalidateDepartments,
    });
}

export function useUpdateDepartment() {
    return useSWRMutation<
        Department,
        AdminApiError,
        string,
        UpdateDepartmentArg
    >(DEPARTMENTS_API, updateDepartment, {
        onSuccess: revalidateDepartments,
    });
}

export function useDeactivateDepartment() {
    return useSWRMutation<
        void,
        AdminApiError,
        string,
        DeactivateDepartmentArg
    >(DEPARTMENTS_API, deactivateDepartment, {
        onSuccess: revalidateDepartments,
    });
}