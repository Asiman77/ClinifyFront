"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
    useDoctorPatients,
    useDoctorRecords,
} from "@/features/doctor/records/api";
import { CreateMedicalRecordSheet } from "@/features/doctor/records/create-medical-record-sheet";

const PAGE_SIZE = 10;

export default function DoctorMedicalRecordsPage() {
    const [page, setPage] = useState(0);
    const {
        data: records,
        error: recordsError,
        isLoading: recordsLoading,
    } = useDoctorRecords({
        page,
        size: PAGE_SIZE,
        sort: "recordDate,desc",
    });
    const {
        data: patients,
        error: patientsError,
        isLoading: patientsLoading,
    } = useDoctorPatients();

    const error = recordsError ?? patientsError;
    const isInitialLoading =
        (recordsLoading && !records) ||
        (patientsLoading && !patients);

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Medical records</h1>
                {patients && (
                    <CreateMedicalRecordSheet patients={patients} />
                )}
            </header>

            {isInitialLoading && (
                <div
                    role="status"
                    className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    Loading medical records...
                </div>
            )}

            {!isInitialLoading && error && (
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

            {!isInitialLoading &&
                !error &&
                records &&
                records.content.length === 0 && (
                    <Empty className="min-h-64">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <HugeiconsIcon
                                    icon={FileAttachmentIcon}
                                    strokeWidth={2}
                                />
                            </EmptyMedia>
                            <EmptyTitle>No medical records found</EmptyTitle>
                            <EmptyDescription>
                                Create a record after reviewing a patient.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

            {!error && records && records.content.length > 0 && (
                <ul className="divide-y">
                    {records.content.map((record) => (
                        <li key={record.id}>
                            <Link
                                href={`/doctor/medical-records/${record.id}`}
                                className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {record.patientFullName}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {formatDate(record.recordDate)}
                                        {" / "}
                                        {record.diagnosis}
                                    </p>
                                </div>
                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {record.labResponses.length}{" "}
                                    {record.labResponses.length === 1
                                        ? "test"
                                        : "tests"}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {!error && records && records.totalPages > 1 && (
                <nav
                    aria-label="Medical records pagination"
                    className="flex items-center justify-between gap-3 border-t pt-4"
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={records.first || recordsLoading}
                        onClick={() =>
                            setPage((current) => Math.max(0, current - 1))
                        }
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            data-icon="inline-start"
                        />
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {records.number + 1} of {records.totalPages}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={records.last || recordsLoading}
                        onClick={() => setPage((current) => current + 1)}
                    >
                        Next
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            data-icon="inline-end"
                        />
                    </Button>
                </nav>
            )}
        </div>
    );
}

function formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
