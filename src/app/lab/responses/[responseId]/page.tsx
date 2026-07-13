"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Spinner } from "@/components/ui/spinner";
import { useLabResponse } from "@/features/lab/api";
import { LabStatusBadge } from "@/features/lab/components/lab-status-badge";
import { LabResponseEditor } from "@/features/lab/components/lab-response-editor";

export default function LabResponseDetailPage() {
    const params = useParams<{
        responseId: string;
    }>();

    const parsedId = Number(params.responseId);
    const responseId =
        Number.isInteger(parsedId) && parsedId > 0
            ? parsedId
            : null;

    const {
        data: response,
        error,
        isLoading,
        mutate,
    } = useLabResponse(responseId);

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
            <Link
                href="/lab/dashboard"
                className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    className="size-4"
                    strokeWidth={2}
                />
                Back to laboratory queue
            </Link>

            {responseId === null && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Invalid laboratory response id
                    </p>
                </div>
            )}

            {responseId !== null && isLoading && (
                <div
                    role="status"
                    className="flex min-h-52 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    Loading laboratory response...
                </div>
            )}

            {responseId !== null && !isLoading && error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Laboratory response could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                </div>
            )}

            {response && (
                <>
                    <header className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-semibold">
                                {response.testName}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Medical record #{response.medicalRecordId}
                            </p>
                        </div>

                        <LabStatusBadge status={response.status} />
                    </header>

                    <section aria-labelledby="request-context-title">
                        <h2
                            id="request-context-title"
                            className="text-xs font-medium uppercase text-muted-foreground"
                        >
                            Request context
                        </h2>

                        <dl className="mt-3 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                            <Detail
                                label="Patient"
                                value={response.patientFullName}
                            />
                            <Detail
                                label="Doctor"
                                value={response.doctorFullName}
                            />
                            <Detail
                                label="Diagnosis"
                                value={
                                    response.diagnosis ||
                                    "Not provided"
                                }
                            />
                            <Detail
                                label="Symptoms"
                                value={
                                    response.symptoms ||
                                    "Not provided"
                                }
                            />
                            <Detail
                                label="Requested"
                                value={formatDateTime(
                                    response.createdAt,
                                )}
                            />
                            <Detail
                                label="Assigned technician"
                                value={
                                    response.labTechnicianFullName ||
                                    "Not assigned"
                                }
                            />
                        </dl>
                    </section>
                    <LabResponseEditor
                        key={`${response.id}-${response.updatedAt}`}
                        response={response}
                        onUpdated={() => mutate()}
                    />
                </>
            )}
        </div>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 break-words">{value}</dd>
        </div>
    );
}

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}