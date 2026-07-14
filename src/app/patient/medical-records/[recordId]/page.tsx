"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Spinner } from "@/components/ui/spinner";
import { usePatientMedicalRecord } from "@/features/patient/records/api";
import { MedicalRecordDetail } from "@/features/records/medical-record-detail";

export default function PatientMedicalRecordDetailPage() {
    const params = useParams<{
        recordId: string;
    }>();

    const parsedRecordId = Number(params.recordId);

    const recordId =
        Number.isInteger(parsedRecordId) &&
            parsedRecordId > 0
            ? parsedRecordId
            : undefined;

    const {
        data: record,
        error,
        isLoading,
    } = usePatientMedicalRecord(recordId);

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            <Link
                href="/patient/medical-records"
                className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    className="size-4"
                    strokeWidth={2}
                />

                Back to medical records
            </Link>

            {!recordId && (
                <p
                    role="alert"
                    className="text-sm text-destructive"
                >
                    Invalid medical record id
                </p>
            )}

            {recordId && isLoading && (
                <div
                    role="status"
                    className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    <span>Loading medical record...</span>
                </div>
            )}

            {recordId && error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Medical record could not be loaded
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                </div>
            )}

            {record && (
                <MedicalRecordDetail record={record} />
            )}
        </div>
    );
}