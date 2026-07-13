"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import {
    DoctorApiError,
    doctorGetJson,
    doctorRequestJson,
} from "@/features/doctor/api-client";
import type {
    CreateMedicalRecordRequest,
    DoctorPatient,
    MedicalRecord,
} from "@/features/doctor/records/types";
import type { PageResponse } from "@/types/pagination";

export type DoctorRecordsQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

export function useDoctorRecords(query: DoctorRecordsQuery = {}) {
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
        ? `/api/doctor/records?${queryString}`
        : "/api/doctor/records";

    return useSWR<PageResponse<MedicalRecord>, DoctorApiError>(
        url,
        doctorGetJson,
    );
}

export function useDoctorRecord(recordId?: number) {
    const url = recordId && recordId > 0
        ? `/api/doctor/records/${recordId}`
        : null;

    return useSWR<MedicalRecord, DoctorApiError>(url, doctorGetJson);
}

export function useDoctorPatients() {
    return useSWR<DoctorPatient[], DoctorApiError>(
        "/api/doctor/records/patients",
        doctorGetJson,
    );
}

async function createRecord(
    url: string,
    { arg }: { arg: CreateMedicalRecordRequest },
) {
    return doctorRequestJson<MedicalRecord>(url, {
        method: "POST",
        body: JSON.stringify(arg),
    });
}

export function useCreateMedicalRecord() {
    return useSWRMutation<
        MedicalRecord,
        DoctorApiError,
        string,
        CreateMedicalRecordRequest
    >("/api/doctor/records", createRecord);
}
