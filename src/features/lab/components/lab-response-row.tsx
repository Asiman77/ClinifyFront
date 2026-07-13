import Link from "next/link";

import { LabStatusBadge } from "./lab-status-badge";
import type { LabResponseSummary } from "@/types/lab";

export function LabResponseRow({
    response,
}: {
    response: LabResponseSummary;
}) {
    return (
        <li>
            <Link
                href={`/lab/responses/${response.id}`}
                className="-mx-2 flex flex-col gap-2 rounded-md px-2 py-3 outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {response.testName}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                        {response.patientFullName}
                        {" \u00b7 "}
                        {response.doctorFullName}
                        {" \u00b7 "}
                        Record #{response.medicalRecordId}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <LabStatusBadge status={response.status} />

                    <time
                        dateTime={response.createdAt}
                        className="text-sm tabular-nums text-muted-foreground"
                    >
                        {formatDate(response.createdAt)}
                    </time>
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
        dateStyle: "medium",
    }).format(date);
}