"use client";

import { useState } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Refresh01Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useOpenLabResponses } from "@/features/lab/api";
import { LabResponseRow } from "@/features/lab/components/lab-response-row";

const PAGE_SIZE = 10;

export default function LabDashboardPage() {
  const [page, setPage] = useState(0);

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useOpenLabResponses({
    page,
    size: PAGE_SIZE,
    sort: "createdAt,asc",
  });

  const responses = data?.content ?? [];
  const showInitialLoading = isLoading && !data;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            Laboratory queue
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Open laboratory requests awaiting review.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {data && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {data.totalElements} open
            </span>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isValidating}
            aria-label="Refresh laboratory queue"
            title="Refresh"
            onClick={() => void mutate()}
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              className={isValidating ? "size-4 animate-spin" : "size-4"}
              strokeWidth={2}
            />
          </Button>
        </div>
      </header>

      {showInitialLoading && (
        <div
          role="status"
          className="flex min-h-52 items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner className="size-5" />
          Loading laboratory queue...
        </div>
      )}

      {!showInitialLoading && error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
        >
          <p className="text-sm font-medium text-destructive">
            Laboratory queue could not be loaded
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
              No open laboratory requests
            </EmptyTitle>
            <EmptyDescription>
              New requests will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!error && responses.length > 0 && (
        <section aria-labelledby="open-requests-title">
          <h2
            id="open-requests-title"
            className="text-xs font-medium uppercase text-muted-foreground"
          >
            Open requests
          </h2>

          <ul className="mt-1 divide-y">
            {responses.map((response) => (
              <LabResponseRow
                key={response.id}
                response={response}
              />
            ))}
          </ul>
        </section>
      )}

      {!error && data && data.totalPages > 1 && (
        <nav
          aria-label="Laboratory queue pagination"
          className="flex items-center justify-between gap-3 border-t pt-4"
        >
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