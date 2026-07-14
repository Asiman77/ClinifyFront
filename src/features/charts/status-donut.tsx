"use client";

import { useMemo } from "react";

import type { AppointmentStatus } from "@/types/appointment";
import type { LabStatus } from "@/types/lab";
import { statusDitherColor } from "@/lib/status-dither";
import { DistributionDonut } from "./distribution-donut";

type AnyStatus = AppointmentStatus | LabStatus;

const STATUS_LABELS: Record<AnyStatus, string> = {
    REQUESTED: "Requested",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No show",
    PENDING: "Pending",
    IN_PROGRESS: "In progress",
};

export type StatusDonutDatum = {
    status: AnyStatus;
    count: number;
};

type StatusDonutProps = {
    data: StatusDonutDatum[];
    totalLabel: string;
    className?: string;
};

export function StatusDonut({
    data,
    totalLabel,
    className,
}: StatusDonutProps) {
    const distribution = useMemo(
        () =>
            data.map((item) => ({
                key: item.status,
                label: STATUS_LABELS[item.status],
                count: item.count,
                color: statusDitherColor[item.status],
            })),
        [data]
    );

    return (
        <DistributionDonut
            data={distribution}
            totalLabel={totalLabel}
            className={className}
        />
    );
}