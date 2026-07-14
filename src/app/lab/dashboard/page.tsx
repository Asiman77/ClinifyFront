"use client";

import { useState } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useLabResponses, useOpenLabResponses } from "@/features/lab/api";
import {
  KpiRow,
  KpiTile,
} from "@/features/charts/kpi-tile";
import { LabResponseRow } from "@/features/lab/components/lab-response-row";
import { StatusDonutLoader } from "@/features/charts/status-donut-loader";

const PAGE_SIZE = 10;
const CHART_PAGE_SIZE = 100;

export default function LabDashboardPage() {
  const [page, setPage] = useState(0);

  const [today] = useState(() => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
      currentDate.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const {
    data,
    error,
    isLoading,
  } = useOpenLabResponses({
    page,
    size: PAGE_SIZE,
    sort: "createdAt,asc",
  });

  const { data: chartData } = useOpenLabResponses({
    page: 0,
    size: CHART_PAGE_SIZE,
    sort: "createdAt,asc",
  });

  const { data: analyticsData } = useLabResponses({
    page: 0,
    size: 100,
    sort: "updatedAt,desc",
  });

  const responses = data?.content ?? [];
  const chartResponses = chartData?.content ?? [];
  const queueDistribution = [
    {
      status: "PENDING" as const,
      count: chartResponses.filter(
        (response) => response.status === "PENDING",
      ).length,
    },
    {
      status: "IN_PROGRESS" as const,
      count: chartResponses.filter(
        (response) =>
          response.status === "IN_PROGRESS",
      ).length,
    },
  ];

  const completedResponses =
    analyticsData?.content.filter(
      (response) => response.status === "COMPLETED",
    ) ?? [];

  const turnaroundValues = completedResponses
    .map(
      (response) =>
        (Date.parse(response.updatedAt) -
          Date.parse(response.createdAt)) /
        (1000 * 60 * 60 * 24),
    )
    .filter(
      (days) => Number.isFinite(days) && days >= 0,
    );

  const averageTurnaroundDays =
    turnaroundValues.length === 0
      ? null
      : Math.round(
        (turnaroundValues.reduce(
          (total, days) => total + days, 0,) / turnaroundValues.length) * 10,) / 10;

  const completedToday = completedResponses.filter(
    (response) =>
      response.updatedAt.slice(0, 10) === today,
  ).length;

  const showInitialLoading = isLoading && !data;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">

      <header className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            Pending lab queue
          </h1>

          {data && data.totalElements > 0 && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {data.totalElements} open
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Open tests awaiting a result, oldest first.
        </p>
      </header>

      {analyticsData && (
        <KpiRow columns={2} reserveDetail>
          <KpiTile
            label="Avg. turnaround"
            value={
              averageTurnaroundDays === null
                ? "—"
                : `${averageTurnaroundDays} days`
            }
            detail={
              averageTurnaroundDays === null
                ? "No completed tests yet"
                : undefined
            }
          />

          <KpiTile
            label="Completed today"
            value={String(completedToday)}
          />
        </KpiRow>
      )}
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
        <div className="flex flex-col gap-4">
          {chartResponses.length > 0 && (
            <section className="flex flex-col gap-2 sm:max-w-xs">
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Queue by status
              </h2>

              <StatusDonutLoader
                data={queueDistribution}
                totalLabel="Total"
              />
            </section>
          )}

          <ul className="divide-y">
            {responses.map((response) => (
              <LabResponseRow
                key={response.id}
                response={response}
              />
            ))}
          </ul>
        </div>
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