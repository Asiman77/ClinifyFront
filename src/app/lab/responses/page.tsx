"use client";

import { useState } from "react";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLabResponses } from "@/features/lab/api";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { LabResponseRow } from "@/features/lab/components/lab-response-row";

const PAGE_SIZE = 10;

export default function LabResponsesPage() {
    const [page, setPage] = useState(0);

    const {
        data,
        error,
        isLoading,
    } = useLabResponses({
        page,
        size: PAGE_SIZE,
        sort: "createdAt,desc",
    });

    const responses = data?.content ?? [];
    const showInitialLoading = isLoading && !data;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <header className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight">
                    Lab response history
                </h1>
                <p className="text-sm text-muted-foreground">
                    Review active and completed laboratory responses.
                </p>
            </header>

            {showInitialLoading && (
                <div
                    role="status"
                    className="flex min-h-52 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    Loading laboratory responses...
                </div>
            )}

            {!showInitialLoading && error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Laboratory responses could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                </div>
            )}

            {!showInitialLoading && !error && responses.length === 0 && (
                <Empty className="min-h-64">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <HugeiconsIcon
                                icon={TestTube01Icon}
                                strokeWidth={2}
                            />
                        </EmptyMedia>
                        <EmptyTitle>
                            No laboratory responses found
                        </EmptyTitle>
                        <EmptyDescription>
                            Created laboratory responses will appear here.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}

            {!error && responses.length > 0 && (
                <ul className="divide-y">
                    {responses.map((response) => (
                        <LabResponseRow
                            key={response.id}
                            response={response}
                        />
                    ))}
                </ul>
            )}

            {!error && data && data.totalPages > 1 && (
                <nav aria-label="Laboratory history pagination" className="flex items-center justify-between gap-3 border-t pt-4" >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={data.first || isLoading}
                        onClick={() =>
                            setPage((current) =>
                                Math.max(0, current - 1),
                            )
                        }
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            data-icon="inline-start"
                        />
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {data.number + 1} of {data.totalPages}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={data.last || isLoading}
                        onClick={() =>
                            setPage((current) => current + 1)
                        }
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