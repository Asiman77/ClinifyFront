import Link from "next/link";
import {
    ArrowRight01Icon,
    TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { LabStatusBadge } from "./lab-status-badge";
import type { LabResponseSummary } from "@/types/lab";

export function LabResponseRow({
    response,
}: {
    response: LabResponseSummary;
}) {
    return (
        <li>
            <Link href={`/lab/responses/${response.id}`} className="group flex flex-col gap-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <HugeiconsIcon
                            icon={TestTube01Icon}
                            className="size-4"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            {response.testName}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                            {response.patientFullName}
                            {" / "}
                            {response.doctorFullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Record #{response.medicalRecordId}
                            {" / "}
                            {formatDate(response.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <LabStatusBadge status={response.status} />
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </div>
            </Link>
        </li>
    );
}

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value.slice(0, 10);
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}