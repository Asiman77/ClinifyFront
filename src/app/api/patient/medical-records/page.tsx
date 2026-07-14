"use client";

import { useState } from "react";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { usePatientMedicalRecords } from "@/features/patient/records/api";
import { PatientMedicalRecordRow } from "@/features/patient/records/patient-medical-record-row";

const PAGE_SIZE = 10;

export default function PatientMedicalRecordsPage() {
    const [page, setPage] = useState(0);

    const {
        data,
        error,
        isLoading,
    } = usePatientMedicalRecords({
        page,
        size: PAGE_SIZE,
        sort: "recordDate,desc",
    });

    const records = data?.content ?? [];
    const showInitialLoading = isLoading && !data;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <h1 className="text-xl font-semibold tracking-tight">
                Medical records
            </h1>

            {showInitialLoading && (
                <div
                    role="status"
                    className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    <span>Loading medical records...</span>
                </div>
            )}

            {!showInitialLoading && error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Medical records could not be loaded
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                </div>
            )}

            {!showInitialLoading &&
                !error &&
                data &&
                records.length === 0 && (
                    <Empty className="min-h-64">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <HugeiconsIcon
                                    icon={FileAttachmentIcon}
                                    strokeWidth={2}
                                />
                            </EmptyMedia>

                            <EmptyTitle>
                                No medical records found
                            </EmptyTitle>

                            <EmptyDescription>
                                Your medical records will appear here
                                after a doctor creates them.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

            {!error && records.length > 0 && (
                <ul className="divide-y">
                    {records.map((record) => (
                        <PatientMedicalRecordRow
                            key={record.id}
                            record={record}
                        />
                    ))}
                </ul>
            )}

            {!error && data && data.totalPages > 1 && (
                <nav
                    aria-label="Medical records pagination"
                    className="flex items-center justify-between gap-3 border-t pt-4"
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={data.first || isLoading}
                        onClick={() =>
                            setPage((currentPage) =>
                                Math.max(0, currentPage - 1),
                            )
                        }
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            strokeWidth={2}
                            data-icon="inline-start"
                        />
                        Previous
                    </Button>

                    <span className="text-xs text-muted-foreground">
                        Page {data.number + 1} of{" "}
                        {data.totalPages}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={data.last || isLoading}
                        onClick={() =>
                            setPage(
                                (currentPage) =>
                                    currentPage + 1,
                            )
                        }
                    >
                        Next
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            strokeWidth={2}
                            data-icon="inline-end"
                        />
                    </Button>
                </nav>
            )}
        </div>
    );
}